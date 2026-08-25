/**
 * Font stacks that route through the CSS custom properties set up in
 * app/layout.tsx via next/font/google. Keeping these as named constants
 * means every component references the same three stacks (mono / display /
 * sans) exactly as the original design did with literal font-family strings.
 */
export const fonts = {
  mono: "var(--font-jetbrains-mono), monospace",
  display: "var(--font-space-grotesk), sans-serif",
  sans: "var(--font-public-sans), system-ui, sans-serif",
} as const;
