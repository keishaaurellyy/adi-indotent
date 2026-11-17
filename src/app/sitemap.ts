import config from "@payload-config";
import type { MetadataRoute } from "next";
import { getPayload } from "payload";

import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";

/** Rebuilt at most hourly, so a CMS edit reaches the sitemap without a deploy. */
export const revalidate = 3600;

type LastModified = {
  categories: Partial<Record<CategorySlug, string>>;
  events?: string;
};

/**
 * When each CMS-backed page's published content last changed.
 *
 * Only pages whose content lives in Payload get a date: a product page from
 * its global's `updatedAt`, /events from the newest published event. Home and
 * contact are mostly code, and stamping build time would claim they changed on
 * every deploy, which teaches crawlers to ignore the field.
 *
 * A CMS outage drops the dates rather than the sitemap.
 */
async function getLastModified(): Promise<LastModified> {
  try {
    const payload = await getPayload({ config });
    const [globals, events] = await Promise.all([
      Promise.all(
        CATEGORY_SLUGS.map((slug) =>
          payload.findGlobal({
            slug,
            depth: 0,
            draft: false,
            select: { updatedAt: true },
          })
        )
      ),
      payload.find({
        collection: "events",
        where: { _status: { equals: "published" } },
        sort: "-updatedAt",
        limit: 1,
        depth: 0,
        select: { updatedAt: true },
      }),
    ]);

    return {
      categories: Object.fromEntries(
        CATEGORY_SLUGS.map((slug, i) => [slug, globals[i]?.updatedAt])
      ),
      events: events.docs[0]?.updatedAt,
    };
  } catch (error) {
    console.error("[sitemap] could not load dates from Payload:", error);
    return { categories: {} };
  }
}

/**
 * Serves /sitemap.xml.
 *
 * The category pages are derived from CATEGORY_SLUGS rather than listed by
 * hand, so the same constant that decides which routes get prerendered also
 * decides which get submitted — the two cannot disagree.
 *
 * They rank above /events: these are the pages carrying the product keywords,
 * and each one holds a full spec sheet and FAQ.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getLastModified();

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/events"),
      lastModified: lastModified.events,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CATEGORY_SLUGS.map((slug) => ({
      url: absoluteUrl(`/products/${slug}`),
      lastModified: lastModified.categories[slug],
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
