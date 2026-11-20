import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

import { mediaProxyRewrites } from "./src/lib/media-url";

const nextConfig: NextConfig = {
  // Drops Next's half of `X-Powered-By`; nothing reads it but scanners.
  poweredByHeader: false,
  // /media/* → the r2.dev bucket, when R2_PUBLIC_URL is one. Read at build
  // time, so changing R2_PUBLIC_URL needs a redeploy.
  async rewrites() {
    return mediaProxyRewrites(process.env.R2_PUBLIC_URL);
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // SAMEORIGIN, not DENY: the Payload admin may frame its own pages.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  images: {
    // Next 16 only generates the qualities listed here; the hero asks for 90.
    qualities: [75, 90],
    // r2.dev buckets are proxied under /media, so they reach next/image as
    // local paths. A custom bucket domain needs adding here.
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
};

export default withPayload(nextConfig);
