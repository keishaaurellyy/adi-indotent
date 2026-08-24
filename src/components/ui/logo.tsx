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
  className?: string;
};

export function Logo({
  variant = "light",
  height = 40,
  preload = false,
  href,
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
    return (
      <Link href={href} aria-label="Adi Indotent — home" className="inline-flex">
        {image}
      </Link>
    );
  }
  return image;
}
