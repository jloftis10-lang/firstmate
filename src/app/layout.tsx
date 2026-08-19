import type { Metadata } from "next";
import { Archivo, Newsreader, Space_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  // The lede sets "miss" in italic — the one italic in the design.
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // The production domain. Canonicals, OG tags and share links all derive
  // from this — keep it in step with the Vercel domain settings.
  metadataBase: new URL("https://cruiseread.com"),
  title: {
    default: "First Mate Cruise — cabin intelligence for travel advisors",
    template: "%s — First Mate Cruise",
  },
  description:
    "A second set of eyes on every cruise booking before your client pays.",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "First Mate Cruise",
    description:
      "A second set of eyes on every cruise booking before your client pays.",
    url: "https://cruiseread.com",
    siteName: "First Mate Cruise",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${spaceMono.variable} h-full antialiased`}
    >
      {/* Root carries fonts and the stylesheet only. The advisor chrome
          lives in `(app)`; `(client)` stays bare on purpose — see the
          note in (app)/layout.tsx. */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
