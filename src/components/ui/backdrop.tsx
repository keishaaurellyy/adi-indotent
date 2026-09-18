import Image from "next/image";
import { cn } from "@/lib/cn";

type BackdropProps = {
  src: string;
  /**
   * Where the photo has faded out completely, as a CSS length or percentage
   * of the section's height. Figma draws the gradient mask to a different
   * stop per section, so it is a value rather than a class — two competing
   * mask-image classes would resolve by stylesheet order under cn().
   */
  fade?: string;
  quality?: number;
  /** `eager` for a backdrop above the fold. */
  loading?: "eager" | "lazy";
  /** Object-position, when the crop needs steering. */
  className?: string;
};

/**
 * The photo behind a dark section: full-bleed, dimmed to 30%, and faded out
 * downward by a gradient mask.
 *
 * Decorative in every use, so it is hidden from assistive tech and inert to
 * the pointer — the section's own content sits above it in a `relative`
 * wrapper, which each caller already provides.
 */
export function Backdrop({
  src,
  fade = "70%",
  quality,
  loading,
  className,
}: BackdropProps) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="100vw"
      quality={quality}
      loading={loading}
      aria-hidden
      style={{
        maskImage: `linear-gradient(to bottom, black, transparent ${fade})`,
      }}
      className={cn(
        "pointer-events-none select-none object-cover opacity-30",
        className
      )}
    />
  );
}
