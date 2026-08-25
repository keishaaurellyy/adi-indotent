import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Serves /sitemap.xml.
 *
 * Only the three routes that actually exist are listed. The Products
 * collection and the category globals hold plenty of indexable content, but
 * none of it has a URL yet — once /produk/[category] lands, map those docs
 * here so a new product is crawlable without a code change.
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
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
