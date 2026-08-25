// Token data for the hand-highlighted Go snippet shown in the "API, up
// close" section. Each line is a list of segments; a segment without a
// color inherits the <pre>'s base text color.

export interface CodeSegment {
  text: string;
  color?: string;
}

const keyword = "#79c0ff";
const fn = "#d2a8ff";
const comment = "#6b7178";
const literal = "#7ee787";

export const codeFilename = "transfer.go";

export const codeLines: CodeSegment[][] = [
  [{ text: "// idempotent, atomic double-entry transfer", color: comment }],
  [
    { text: "func", color: keyword },
    { text: " (s *Ledger) " },
    { text: "Transfer", color: fn },
    { text: "(ctx " },
    { text: "context", color: keyword },
    { text: ".Context, r Req) " },
    { text: "error", color: keyword },
    { text: " {" },
  ],
  [
    { text: "  " },
    { text: "return", color: keyword },
    { text: " s.tx(ctx, " },
    { text: "func", color: keyword },
    { text: "(tx *Tx) " },
    { text: "error", color: keyword },
    { text: " {" },
  ],
  [
    { text: "    " },
    { text: "if", color: keyword },
    { text: " tx.Seen(r.Key) {" },
  ],
  [
    { text: "      " },
    { text: "return", color: keyword },
    { text: " " },
    { text: "nil", color: literal },
    { text: " " },
    { text: "// replay: no-op", color: comment },
  ],
  [{ text: "    }" }],
  [{ text: "    tx.Debit(r.From, r.Amount)" }],
  [{ text: "    tx.Credit(r.To, r.Amount)" }],
  [
    { text: "    " },
    { text: "return", color: keyword },
    { text: " tx.Commit(r.Key)" },
  ],
  [{ text: "  })" }],
  [{ text: "}" }],
];
