import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /**
   * Max width of a centred block, which is what decides where the title
   * wraps. Figma's default is 640px; pass `"none"` to let it run full width.
   */
  maxWidth?: string;
  /** Narrower cap for the description alone, when it should wrap earlier. */
  descriptionMaxWidth?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  maxWidth = "40rem",
  descriptionMaxWidth,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    // Arrives as one block rather than line by line: the eyebrow, title and
    // description are a single thought, and staggering them would read as
    // three separate arrivals above every section on the site.
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-6 lg:mb-16",
        centered && "mx-auto items-center text-center",
        className
      )}
      // Inline so callers can pass any value without Tailwind needing to
      // see the class at build time.
      style={centered ? { maxWidth } : undefined}
    >
      {eyebrow && (
        <span className="text-body-md font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      {/* Figma: h2 (48px desktop), Semibold 600, 120%. */}
      <h2 className="text-h2 font-semibold text-balance">{title}</h2>
      {description && (
        <p
          className={cn(
            "text-body-xl text-foreground-secondary",
            !centered && "max-w-2xl"
          )}
          style={descriptionMaxWidth ? { maxWidth: descriptionMaxWidth } : undefined}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
