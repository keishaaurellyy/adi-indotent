import { Reveal } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "spec" }>;
  tone?: "default" | "muted";
};

/**
 * Label-and-value rows. Used by `specifications`.
 *
 * A description list rather than a table: each row is one property of one
 * product, not a cell in a grid being compared across columns. `<dl>` says
 * that, and it reflows to stacked rows on narrow screens without the
 * horizontal scrolling a real table would need.
 *
 * Full width and unboxed, with hairlines between rows — the design treats this
 * as a continuation of the page rather than a card, so the only chrome is the
 * divider. The label sits in the secondary text colour and the value in the
 * primary one, which is what separates the two columns once the box is gone.
 *
 * The label column is a percentage, not a fixed width: at 36% it lands on the
 * same 448px it had at desktop, but it also shrinks. Pinned at 28rem it did
 * not, and between 640px and 768px it squeezed the value into a ribbon — the
 * longest row wrapped to eight lines at 640px.
 *
 * Stacked below md, where side-by-side would leave neither column usable. The
 * pair is tightened to a 4px gap there so each label reads as belonging to the
 * value under it rather than as another paragraph, and the label drops a step
 * in size, since colour alone is thin hierarchy at that width.
 */
export function SpecTable({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      {/* No stagger: twenty spec rows arriving one by one is a queue to sit
          through, not a flourish. */}
      <Reveal as="dl" className="divide-y divide-border border-t border-border">
        {block.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-1 py-5 md:grid-cols-[36%_minmax(0,1fr)] md:gap-8 md:py-7"
          >
            <dt className="text-body-lg text-foreground-secondary md:text-body-xl">
              {item.label}
            </dt>
            <dd className="text-body-xl text-foreground">
              {/* An em dash keeps the row's shape when a value is unfilled. */}
              {item.value ?? "—"}
            </dd>
          </div>
        ))}
      </Reveal>
    </SectionShell>
  );
}
