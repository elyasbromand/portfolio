/**
 * Server-only. Reads GITHUB_TOKEN (never NEXT_PUBLIC_-prefixed) and hits
 * GitHub's GraphQL API for real profile stats. Falls back to zeros if the
 * token is missing or the API call fails, so a GitHub outage can't break
 * the production build.
 */
export interface GithubStats {
  publicRepos: number;
  starsEarned: number;
  /** Sum of totalContributions across every year since account creation. */
  contributions: number;
  /** Contribution count for each of the last 28 days, oldest first. */
  recentActivity: number[];
}

const FALLBACK: GithubStats = {
  publicRepos: 0,
  starsEarned: 0,
  contributions: 0,
  recentActivity: [],
};

const CREATED_AT_QUERY = `
  query($login: String!) {
    user(login: $login) { createdAt }
  }
`;

interface CreatedAtResponse {
  data?: { user: { createdAt: string } };
  errors?: { message: string }[];
}

/** contributionsCollection only accepts <=1 year ranges, so one alias per
 * calendar year since account creation, all in a single request. */
function buildStatsQuery(years: number[]): string {
  const yearFields = years
    .map(
      (y) => `
    y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y + 1}-01-01T00:00:00Z") {
      contributionCalendar { totalContributions }
    }`
    )
    .join("\n");

  return `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
          totalCount
          nodes { stargazerCount }
        }
        recent: contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { contributionCount } }
          }
        }
        ${yearFields}
      }
    }
  `;
}

interface StatsResponse {
  data?: {
    user: {
      repositories: {
        totalCount: number;
        nodes: { stargazerCount: number }[];
      };
      recent: {
        contributionCalendar: {
          weeks: { contributionDays: { contributionCount: number }[] }[];
        };
      };
      [yearAlias: string]:
        | { contributionCalendar: { totalContributions: number } }
        | unknown;
    };
  };
  errors?: { message: string }[];
}

async function graphql<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  return res.json();
}

export async function getGithubStats(login: string): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is not set — Metrics will show zeros.");
    return FALLBACK;
  }

  try {
    const createdAtJson = await graphql<CreatedAtResponse>(token, CREATED_AT_QUERY, { login });
    if (createdAtJson.errors?.length) throw new Error(createdAtJson.errors[0].message);
    if (!createdAtJson.data) throw new Error("GitHub API returned no data");

    const startYear = new Date(createdAtJson.data.user.createdAt).getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();
    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );

    const statsJson = await graphql<StatsResponse>(token, buildStatsQuery(years), { login });
    if (statsJson.errors?.length) throw new Error(statsJson.errors[0].message);
    if (!statsJson.data) throw new Error("GitHub API returned no data");

    const user = statsJson.data.user;
    const starsEarned = user.repositories.nodes.reduce(
      (sum, r) => sum + r.stargazerCount,
      0
    );
    const contributions = years.reduce((sum, y) => {
      const yearData = user[`y${y}`] as
        | { contributionCalendar: { totalContributions: number } }
        | undefined;
      return sum + (yearData?.contributionCalendar.totalContributions ?? 0);
    }, 0);
    const days = user.recent.contributionCalendar.weeks.flatMap(
      (w) => w.contributionDays
    );

    return {
      publicRepos: user.repositories.totalCount,
      starsEarned,
      contributions,
      recentActivity: days.slice(-28).map((d) => d.contributionCount),
    };
  } catch (err) {
    console.warn("Failed to fetch GitHub stats:", err);
    return FALLBACK;
  }
}
