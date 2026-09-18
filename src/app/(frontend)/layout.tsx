import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HeroImagePrefetch } from "@/components/perf/hero-image-prefetch";
import { openGraphBase } from "@/lib/metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { jsonLd, localBusinessSchema } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets every page below express canonical, og:url and og:image as a
  // root-relative path; without it those fields have to be absolute or the
  // build fails.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Pages set the bare page name and get the brand appended, so the two
    // never drift apart.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    ...openGraphBase,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          Warms the other pages' hero photos once this one is idle. Here rather
          than per page so a route added later is covered by adding it to
          ROUTE_HERO_IMAGES alone.
        */}
        <HeroImagePrefetch />
        {/*
          One LocalBusiness record for the whole frontend. It sits here rather
          than on the contact page alone so any page Google lands on first
          still carries the address, hours and phone.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema()) }}
        />
      </body>
    </html>
  );
}
