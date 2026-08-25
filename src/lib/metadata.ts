import type { Metadata } from "next";

import { SITE_NAME, SITE_OG_IMAGE } from "./site";

/**
 * The openGraph fields every page shares.
 *
 * Next merges metadata shallowly, so a page that sets `openGraph` at all
 * replaces the parent's whole object — siteName and images included. Spreading
 * this into each one is what keeps them from silently disappearing.
 */
export const openGraphBase = {
  // Asserted narrow so it stays the "website" literal the OpenGraph union
  // discriminates on. A blanket `as const` would freeze `images` into a
  // readonly tuple, which the OGImage[] field rejects.
  type: "website" as const,
  locale: "id_ID",
  siteName: SITE_NAME,
  images: [SITE_OG_IMAGE],
};

/**
 * Builds the metadata for one page: the `<title>`, the description, a
 * self-referencing canonical, and social tags that agree with all three.
 *
 * `path` is root-relative — `metadataBase` in the root layout turns it into
 * the absolute URL that canonical and og:url both require. Setting the
 * canonical per page matters: hoisting it into the layout would point every
 * page at the same URL and drop the rest from the index.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Without the brand — the root layout's title template appends it. */
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      // The title template applies only to `<title>`, so og:title spells the
      // brand out to match what a shared link should read as.
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  };
}
