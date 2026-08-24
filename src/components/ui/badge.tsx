import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "outline" | "accent";
};

const tones = {
  default: "bg-muted text-muted-foreground",
  outline: "border border-border text-muted-foreground",
  // Figma "Kategori event" chip: cyan outline on white.
  accent: "border border-accent text-accent",
};

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-body-md font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
