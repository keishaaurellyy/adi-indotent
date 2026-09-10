import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type ImageFrameProps = {
  /** Absent renders the well empty, holding its space rather than collapsing. */
  src?: StaticImageData | string | null;
  alt: string;
  /** next/image `sizes`; every caller renders at a different width. */
  sizes: string;
  /**
   * Aspect ratio, corner radius and the colour behind an absent photo. Supplied
   * per caller rather than defaulted, because cn() has no tailwind-merge — a
   * default aspect or radius here would fight the caller's and resolve by
   * stylesheet order.
   */
  className?: string;
  /** Extra classes on the image itself, e.g. a hover transform. */
  imageClassName?: string;
  /**
   * `contain` for artwork that must not be cropped — line diagrams, mainly.
   * A prop rather than a class for the same reason as above: `object-cover`
   * and `object-contain` together would resolve by stylesheet order.
   */
  fit?: "cover" | "contain";
  quality?: number;
  /** For a well that holds the page's largest paint. */
  preload?: boolean;
};

/**
 * The image well the cards share: a ratio-locked box that crops its photo and
 * clips it to the box's own radius.
 *
 * Written once because every place that had it — the product tiles, the event
 * cards, the Solusi Tenda pair, the category hero and all four category
 * sections — must keep the same behaviour when a photo is missing: the well
 * still occupies its space, so a half-illustrated grid does not render as
 * ragged rows.
 */
export function ImageFrame({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  fit = "cover",
  quality,
  preload,
}: ImageFrameProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={preload}
          className={cn(
            fit === "contain" ? "object-contain" : "object-cover",
            imageClassName
          )}
        />
      )}
    </div>
  );
}
