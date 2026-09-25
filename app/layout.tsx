import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig, baseOpenGraph } from "@/lib/seo";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    ...baseOpenGraph,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
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
      suppressHydrationWarning
    >
      <head>
        {/* Runs during HTML parsing, before first paint: marks JS as available
            so [data-reveal] elements start hidden instead of flashing. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","")`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
