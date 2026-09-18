import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/cn";

type LogoProps = {
  /** `light` for light backgrounds, `dark` for dark sections (bg-background-dark). */
  variant?: "light" | "dark";
  /**
   * Intrinsic height in px; width follows the aspect ratio. Override the
   * rendered size with a height utility in `className` (e.g. `h-10 lg:h-12`).
   */
  height?: number;
  /** Preload when the logo is above the fold, e.g. in the header. */
  preload?: boolean;
  /** Wrap in a link to `href`. Omit to render the image alone. */
  href?: string;
  /** Extra classes on that link — the header needs it not to shrink. */
  linkClassName?: string;
  className?: string;
};

export function Logo({
  variant = "light",
  height = 40,
  preload = false,
  href,
  linkClassName,
  className,
}: LogoProps) {
  const src = variant === "dark" ? logoDark : logoLight;

  const image = (
    <Image
      src={src}
      alt="Adi Indotent"
      height={height}
      // Static import supplies the intrinsic size; `height` scales it and
      // `width: auto` keeps the aspect ratio without distorting the mark.
      style={{ width: "auto" }}
      preload={preload}
      className={cn("select-none", className)}
    />
  );

  if (href) {
    // The label lives here rather than at the two call sites, so the header
    // and the footer cannot end up describing the same link differently.
    return (
      <Link
        href={href}
        aria-label="Adi Indotent — home"
        className={cn("inline-flex", linkClassName)}
      >
        {image}
      </Link>
    );
  }
  return image;
}
