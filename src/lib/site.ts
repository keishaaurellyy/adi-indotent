/** The live domain. Canonical URLs, the sitemap and the JSON-LD point here in production. */
export const PRODUCTION_URL = "https://adi-indotent.com";

/** True on the production deployment. Undefined off Vercel, so false locally. */
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

/**
 * True on a Vercel preview, which includes the staging branch. These must not
 * compete with the live site in search results.
 */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

/**
 * Absolute origin this site is served from.
 *
 * Canonical URLs, the sitemap and the JSON-LD all need fully-qualified URLs,
 * and the origin differs per environment. In order:
 *
 * 1. NEXT_PUBLIC_SITE_URL, when set. An explicit override always wins.
 * 2. The live domain on the production deployment, so it is right even if the
 *    variable is forgotten. Without a fallback, every canonical and sitemap
 *    entry would point at localhost and tell Google the real pages do not
 *    exist.
 * 3. The deployment's own host on a Vercel preview, so its links resolve to
 *    itself rather than to production.
 * 4. localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (IS_PRODUCTION
    ? PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

/** Brand name. Doubles as the `<title>` suffix and the schema.org business name. */
export const SITE_NAME = "Adi Indotent";

/**
 * How a page title and the brand are joined, for both `<title>` and og:title.
 * `%s` is the page's own title.
 */
export const TITLE_TEMPLATE = `%s - ${SITE_NAME}`;

/**
 * `<title>` for the home page, which has no page name of its own. Written in
 * the same "name - brand" shape as every other page, and kept near 60
 * characters, where search results truncate.
 */
export const SITE_TITLE = `Sewa Tenda Sarnafil, Roder & Peralatan Event - ${SITE_NAME}`;

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
