import { cn } from "@/lib/cn";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Muted background to alternate section rhythm on long pages. */
  tone?: "default" | "muted";
};

export function Section({ tone = "default", className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 lg:py-20",
        tone === "muted" && "bg-muted",
        className
      )}
      {...props}
    />
  );
}
