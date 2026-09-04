import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "faq" }>;
  tone?: "default" | "muted";
};

/**
 * Collapsible questions. Used by `pertanyaan_umum`.
 *
 * Built on native `<details>`/`<summary>`, so this stays a server component:
 * no "use client", no JavaScript shipped, and the open/close behaviour,
 * keyboard handling and screen-reader semantics come from the browser rather
 * than from ARIA attributes we would have to maintain. The answers are also
 * present in the HTML while collapsed, which is what lets the FAQPage
 * structured data on this page match visible content.
 */
export function FaqAccordion({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="mx-auto grid max-w-3xl gap-4">
        {block.items.map((item) => (
          <li key={item.id}>
            <details className="group rounded-xl border border-border bg-background px-6 open:pb-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-body-lg font-semibold text-foreground marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {item.question}
                {/* Rotates to point up once the row is open. */}
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="size-5 shrink-0 text-foreground-secondary transition-transform group-open:-rotate-180"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              {item.answer && (
                <p className="pb-4 text-body-lg text-foreground-secondary">
                  {item.answer}
                </p>
              )}
            </details>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
