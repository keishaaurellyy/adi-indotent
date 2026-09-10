import type { StaticImageData } from "next/image";
import landingBg from "@/assets/landing-bg.png";

/**
 * Everything the destination page passes to its own `next/image`, because the
 * warmed request has to be byte-identical to the one that page will make —
 * `quality` and `sizes` both land in the generated URL and srcset, so a
 * mismatch downloads a second copy instead of filling the cache.
 */
export type PrefetchImage = {
  src: StaticImageData | string;
  sizes: string;
  quality?: number;
};

/**
 * The photo each route opens on — its largest paint, and the one thing a
 * navigation still has to wait for once Next has prefetched the route itself.
 *
 * Keyed by pathname so the warmer can skip the page it is already on. Keep a
 * route out of here rather than guessing: warming the wrong asset costs the
 * visitor bandwidth and buys nothing.
 */
export const ROUTE_HERO_IMAGES: Record<string, PrefetchImage> = {
  "/": { src: landingBg, sizes: "100vw", quality: 90 },
  "/events": {
    src: "/events/events-header-bg.jpg",
    sizes: "100vw",
    quality: 90,
  },
  "/contact": { src: "/contact-bg.svg", sizes: "100vw" },
};

/** Every hero but the current page's. */
export function heroImagesExcept(pathname: string): PrefetchImage[] {
  return Object.entries(ROUTE_HERO_IMAGES)
    .filter(([route]) => route !== pathname)
    .map(([, image]) => image);
}
