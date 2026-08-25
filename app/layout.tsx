import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-600.ttf", weight: "600", style: "normal" },
  ],
  weight: "400 600",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-600.ttf", weight: "600", style: "normal" },
  ],
  weight: "600",
  variable: "--font-space-grotesk",
  display: "swap",
});

const publicSans = localFont({
  src: [
    { path: "./fonts/public-sans-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/public-sans-500.ttf", weight: "500", style: "normal" },
  ],
  weight: "400 500",
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elyas Bromand — Backend Engineer",
  description:
    "Elyas Bromand — backend engineer focused on distributed services, data integrity, and low-latency APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${publicSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
