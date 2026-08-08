import Link from "next/link";
import { notFound } from "next/navigation";
import projects from "../../data/projects";

export default async function ProjectPage({ params }) {
  const { slug } = await params;

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <article className="mx-auto max-w-[1200px] px-6 py-24">
        <Link
          href="/#projects"
          className="text-sm font-medium text-[#0D9488] hover:underline"
        >
          ← Back to projects
        </Link>

        <header className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#0D9488]">
            {project.category}
          </p>

          <h1 className="mt-4 text-[56px] font-bold leading-[1.1] text-[#111827]">
            {project.title}
          </h1>

          <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
            {project.description}
          </p>
        </header>

        <div className="mt-16 max-w-3xl space-y-16">
          <section>
            <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
              The problem
            </h2>

            <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.problem}
            </p>
          </section>

          <section>
            <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
              What I did and decided
            </h2>

            <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.whatIDid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
              Reliability
            </h2>

            <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.reliability}
            </p>
          </section>

          <section>
            <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
              What came of it
            </h2>

            <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.outcome}
            </p>

            <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.reflection}
            </p>
          </section>

          <section>
            <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
              Next time
            </h2>

            <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.nextTime}
            </p>
          </section>

          <section className="border-t border-[#1F2937]/15 pt-10">
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-[#1F2937] px-6 py-3 text-sm font-medium text-[#F9FAFB] transition-colors hover:bg-[#0F766E]"
            >
              View Repository
            </a>
          </section>
        </div>
      </article>
    </main>
  );
}