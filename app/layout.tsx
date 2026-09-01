import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meta Breaker Lab",
  description:
    "An explainable Smogon OU team analyzer and anti-meta experimentation lab.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
