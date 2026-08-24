import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "bg-accent text-accent-foreground hover:bg-accent-hover",
  outline:
    "border border-border bg-transparent hover:bg-muted",
  ghost: "bg-transparent hover:bg-muted",
};

/*
 * `md` is the Figma spec: 40px tall, 8px/16px padding, 8px gap (the `gap-2`
 * in `base`). `sm` and `lg` are proportional — no Figma spec for them yet.
 */
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-body-md",
  md: "h-10 px-4 text-body-lg",
  lg: "h-12 px-6 text-body-xl",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  React.ComponentProps<typeof Link> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

/** Renders a Next.js `Link` when `href` is given, otherwise a `<button>`. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    return <Link className={classes} {...(props as ButtonAsLink)} />;
  }
  return <button className={classes} {...(props as ButtonAsButton)} />;
}
