import { cn } from "@/lib/cn";

/**
 * Card typography. The design's cards differ too much in frame — flush
 * dividers here, a dark-section rail there — to share a container, but the
 * title and body styles are identical across all of them.
 */
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-h6 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-2 text-body-lg text-foreground-secondary", className)}
      {...props}
    />
  );
}
