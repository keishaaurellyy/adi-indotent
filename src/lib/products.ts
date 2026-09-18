// Server-only by construction: importing `payload` or the config from a
// client component fails the build, so no "server-only" guard is needed.
import config from "@payload-config";
import { getPayload } from "payload";
import type { Media, Product } from "@/payload-types";

/** A product document flattened down to what the card actually renders. */
export type ProductSummary = {
  id: number;
  title: string;
  description?: string | null;
  /** Category detail page. Built from `category_key`, which is the route slug. */
  href: string;
  /** Absolute R2 URL, or a /api/media/file/... path when R2 is not configured. */
  image?: string | null;
  imageAlt?: string;
};

/**
 * `hero_image` is a relation, so it arrives as an id until Payload populates
 * it. On `products` it is also virtual — an afterRead hook copies it off the
 * matching category global, so it is null whenever that global has none.
 */
function isPopulated(image: Product["hero_image"]): image is Media {
  return typeof image === "object" && image !== null;
}

function toProductSummary(product: Product): ProductSummary {
  const image = isPopulated(product.hero_image) ? product.hero_image : null;
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    href: `/products/${product.category_key}`,
    image: image?.url ?? null,
    imageAlt: image?.alt ?? "",
  };
}

/**
 * Published product categories in the order editors set in the admin.
 *
 * Reads through Payload's Local API rather than fetching /api/products over
 * HTTP: the CMS runs inside this app, so a request to our own route would add
 * a network hop and need an absolute URL that differs per environment.
 *
 * A CMS outage degrades to an empty list instead of taking down the whole
 * page — the section still renders its heading.
 *
 * No `limit`: `category_key` is a unique select with three options, so the
 * collection cannot outgrow Payload's default page of ten.
 */
export async function getProducts(): Promise<ProductSummary[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "products",
      // Local API calls bypass access control, so drafts have to be excluded
      // explicitly or unpublished categories leak onto the site.
      where: { _status: { equals: "published" } },
      sort: "display_order",
      // Enough to populate `hero_image`; the Media collection's
      // defaultPopulate trims that to alt/filename/url.
      depth: 1,
    });

    return docs.map(toProductSummary);
  } catch (error) {
    console.error("[products] could not load products from Payload:", error);
    return [];
  }
}
