/**
 * Absolute origin this site is served from.
 *
 * Canonical URLs, the sitemap and the JSON-LD all need fully-qualified URLs,
 * and the origin differs per environment — production, Vercel previews and
 * localhost are three different hosts — so it cannot be a hardcoded constant.
 *
 * Set NEXT_PUBLIC_SITE_URL to https://adi-indotent.com on the Vercel
 * production environment. Left unset, every canonical and sitemap entry
 * points at localhost, which tells Google the pages do not exist.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Brand name. Doubles as the `<title>` suffix and the schema.org business name. */
export const SITE_NAME = "Adi Indotent";

/**
 * Fallback `<title>` for the home page. Search results truncate around 60
 * characters, so the brand comes first and the keywords follow.
 */
export const SITE_TITLE = "Adi Indotent — Sewa Tenda Sarnafil, Roder & Peralatan Event";

/**
 * The `<meta name="description">` Google shows under the result. Not a ranking
 * factor on its own, but it is the click-through pitch, so it names the
 * products by the words people actually search for.
 */
export const SITE_DESCRIPTION =
  "Adi Indotent menyewakan tenda Sarnafil, tenda Roder, dan peralatan pendukung event. " +
  "Berpengalaman menangani acara korporat, pemerintahan, festival, hingga gathering.";

/**
 * Shared social preview image. 1200x800 rather than the ideal 1200x630, so
 * platforms centre-crop it — acceptable for a photo, worth replacing with a
 * purpose-built card.
 */
export const SITE_OG_IMAGE = {
  url: "/sarnafil/card.jpg",
  width: 1200,
  height: 800,
  alt: "Tenda Sarnafil Adi Indotent terpasang di lokasi acara",
} as const;

/** Joins a root-relative path onto SITE_URL without doubling the slash. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
