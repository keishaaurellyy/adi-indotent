import type { MetadataRoute } from "next";

import { CATEGORY_SLUGS } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";

/**
 * Serves /sitemap.xml.
 *
 * The category pages are derived from CATEGORY_SLUGS rather than listed by
 * hand, so the same constant that decides which routes get prerendered also
 * decides which get submitted — the two cannot disagree.
 *
 * They rank above /events: these are the pages carrying the product keywords,
 * and each one holds a full spec sheet and FAQ.
 *
 * `lastModified` is deliberately absent. The honest value is the date each
 * page's content changed, which nothing currently tracks; stamping build time
 * instead would claim every page changed on every deploy, and crawlers
 * discount the field once it stops correlating with real edits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/events"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CATEGORY_SLUGS.map((slug) => ({
      url: absoluteUrl(`/products/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
