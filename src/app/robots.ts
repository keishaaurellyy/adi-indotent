import type { MetadataRoute } from "next";

import { IS_PREVIEW, absoluteUrl } from "@/lib/site";

/**
 * Serves /robots.txt.
 *
 * The Payload admin and its REST/GraphQL routes are crawlable by default and
 * carry no content worth indexing, so they are excluded — an indexed /admin
 * login page competes with real pages for crawl budget.
 */
export default function robots(): MetadataRoute.Robots {
  // A preview or staging deployment is a copy of the live site on another
  // host. Indexing it would split ranking between the two, so it is closed off
  // entirely, with no sitemap to advertise.
  if (IS_PREVIEW) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

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
