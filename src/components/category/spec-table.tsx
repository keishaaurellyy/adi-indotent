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
 */
export function SpecTable({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <dl className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
        {block.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-1 p-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6 sm:p-6"
          >
            <dt className="text-body-lg font-semibold text-foreground">
              {item.label}
            </dt>
            <dd className="text-body-lg text-foreground-secondary">
              {/* An em dash keeps the row's shape when a value is unfilled. */}
              {item.value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
