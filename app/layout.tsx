import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/seo";

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
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: siteConfig.url,
    locale: "en_US",
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
    >
      <body>{children}</body>
    </html>
  );
}
