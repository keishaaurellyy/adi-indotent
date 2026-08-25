import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Serves /robots.txt.
 *
 * The Payload admin and its REST/GraphQL routes are crawlable by default and
 * carry no content worth indexing, so they are excluded — an indexed /admin
 * login page competes with real pages for crawl budget.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
