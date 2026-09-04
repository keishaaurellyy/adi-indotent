import { CardDescription, CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "useCase" }>;
  tone?: "default" | "muted";
};

/**
 * Name-plus-description cards. Used by `use_cases` on Roder and Sarnafil.
 *
 * Three across on desktop: the section runs to six items on Roder and five on
 * Sarnafil, so three columns divide both without a stranded single item on the
 * last row.
 */
export function UseCaseGrid({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {block.items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border bg-background p-6"
          >
            <CardTitle>{item.name}</CardTitle>
            {item.description && (
              <CardDescription>{item.description}</CardDescription>
            )}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
