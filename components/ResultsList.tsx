import { fonts } from "@/lib/fonts";

interface ResultsListProps {
  results: string[];
}

export default function ResultsList({ results }: ResultsListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {results.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: "#7ee787", fontFamily: fonts.mono, fontSize: 14, marginTop: 2 }}>
            ◆
          </span>
          <p style={{ fontSize: 15.5, color: "#c4c9cf", lineHeight: 1.6 }}>{r}</p>
        </div>
      ))}
    </div>
  );
}