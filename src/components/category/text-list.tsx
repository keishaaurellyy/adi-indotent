import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "text" }>;
  tone?: "default" | "muted";
};

/**
 * A checklist. Used by `yang_anda_dapatkan`, whose items are a lone paragraph
 * each — what the rental includes, so a tick reads better than a bullet.
 *
 * The tick is inline rather than a file in /public/icon: there is no check
 * asset in the design exports yet, and inlining lets it inherit `currentColor`
 * instead of being locked to whatever colour an SVG was saved with.
 *
 * It is decorative — the list semantics already say these are items, so
 * repeating "included" on every row would only add noise for a screen reader.
 */
export function TextList({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="mx-auto grid max-w-3xl gap-4">
        {block.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              className="mt-1 size-5 shrink-0 text-primary"
            >
              <path
                d="m4.5 10.5 3.5 3.5 7.5-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-body-lg text-foreground-secondary">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
