/**
 * Where browsers load uploaded media from. Shared by payload.config.ts, which
 * builds each file's `url`, and next.config.ts, which sets up the proxy.
 *
 * Imported from next.config.ts, so it must stay free of Payload and of the `@/`
 * path alias.
 */

/** Same-origin path an r2.dev bucket is proxied under. */
export const MEDIA_PROXY_PATH = "/media";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * The whole r2.dev domain is blocked by Internet Positif on Indonesian ISPs, so
 * a browser must never be sent there. The site proxies those buckets instead.
 */
export function isR2DevUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}

/**
 * Base that file URLs are built on, given `R2_PUBLIC_URL`:
 *
 * - unset: `undefined`, and Payload streams files itself through
 *   /api/media/file/<filename>
 * - an r2.dev URL: `/media` on this site, proxied by the rewrite from
 *   `mediaProxyRewrites`
 * - anything else (a custom domain on the bucket): used as is
 */
export function publicMediaBase(publicBucketUrl: string | undefined): string | undefined {
  if (!publicBucketUrl) return undefined;
  return isR2DevUrl(publicBucketUrl) ? MEDIA_PROXY_PATH : trimTrailingSlash(publicBucketUrl);
}

/**
 * Proxies /media/* to an r2.dev bucket. On Vercel an external rewrite is
 * served by the CDN, so it never starts a function, never boots Payload and
 * never touches the database.
 */
export function mediaProxyRewrites(publicBucketUrl: string | undefined) {
  if (!publicBucketUrl || !isR2DevUrl(publicBucketUrl)) return [];
  return [
    {
      source: `${MEDIA_PROXY_PATH}/:path*`,
      destination: `${trimTrailingSlash(publicBucketUrl)}/:path*`,
    },
  ];
}
