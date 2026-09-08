import { CardDescription, CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "useCase" }>;
  tone?: "default" | "muted";
};

/**
 * Numbered cards. Used by `use_cases` on Roder and Sarnafil.
 *
 * An `ol`, not a `ul`: the design prints a running number on every card, so
 * the order is visible to sighted readers and the markup should say the same
 * thing rather than leaving the numerals as decoration a screen reader skips.
 *
 * Three across on desktop: the section runs to six items on Roder and five on
 * Sarnafil, so three columns divide both without a stranded single item on the
 * last row.
 */
export function UseCaseGrid({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {block.items.map((item, index) => (
          <li
            key={item.id}
            className="rounded-2xl bg-background-grey p-6 lg:p-8"
          >
            {/* Zero-padded to two digits, as in the design. Derived from the
                position rather than stored, so reordering in the admin
                renumbers the cards instead of leaving a gap. */}
            <span className="text-h6 font-bold text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <CardTitle className="mt-6">{item.name}</CardTitle>
            {item.description && (
              <CardDescription>{item.description}</CardDescription>
            )}
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
