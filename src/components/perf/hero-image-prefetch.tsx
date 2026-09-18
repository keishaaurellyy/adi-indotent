"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { heroImagesExcept } from "@/lib/route-images";

/** `navigator.connection`, which TypeScript's lib.dom does not declare. */
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * True unless the visitor is on a metered or slow connection. Warming an
 * image they may never look at is a fair trade on wifi and a rude one on a
 * capped 3G plan, and Save-Data is an explicit request not to.
 */
function shouldWarm(): boolean {
  const connection = (navigator as Navigator & {
    connection?: NetworkInformation;
  }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return connection.effectiveType !== "slow-2g" && connection.effectiveType !== "2g";
}

/**
 * Loads the other pages' hero photos once this one has settled, so a click on
 * the navbar lands on a page whose largest image is already in cache.
 *
 * `<Link>` prefetching covers the route and its data but never its images, so
 * without this the first paint after a navigation still waits on a download
 * that could have happened while the visitor was reading.
 *
 * Renders real `next/image` elements rather than hand-built `<link rel=
 * "prefetch">` tags: the optimizer's URL carries the width and quality it was
 * asked for, and letting the same component generate it is the only way to be
 * sure the warmed request matches the one the destination will make.
 */
export function HeroImagePrefetch() {
  const pathname = usePathname();
  const [warm, setWarm] = useState(false);

  // A navigation makes the list change under us, and the route just left would
  // start downloading at the very moment the new page wants the network. Go
  // cold and wait for idle again — adjusted during render rather than in an
  // effect, so it costs no extra pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setWarm(false);
  }

  // Mounts nothing until the browser is idle, so these downloads queue behind
  // the current page's own images instead of competing with them for
  // bandwidth and connections.
  useEffect(() => {
    if (!shouldWarm()) return;

    // requestIdleCallback is still missing on older Safari; the timeout is
    // both the fallback and the ceiling on how long idle is worth waiting for.
    if (typeof window.requestIdleCallback !== "function") {
      const timer = window.setTimeout(() => setWarm(true), 2000);
      return () => window.clearTimeout(timer);
    }
    const handle = window.requestIdleCallback(() => setWarm(true), {
      timeout: 4000,
    });
    return () => window.cancelIdleCallback(handle);
  }, [pathname]);

  if (!warm) return null;

  return (
    <div
      aria-hidden
      // Fixed and zero-sized so it takes no space and cannot be scrolled to.
      // `sizes` is what decides which srcset candidate the browser picks, not
      // the box, so a collapsed container still fetches the full-width file
      // the destination will ask for.
      className="pointer-events-none fixed top-0 left-0 size-0 overflow-hidden"
    >
      {heroImagesExcept(pathname).map((image) => (
        <Image
          key={typeof image.src === "string" ? image.src : image.src.src}
          src={image.src}
          alt=""
          fill
          sizes={image.sizes}
          quality={image.quality}
          loading="eager"
        />
      ))}
    </div>
  );
}
