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
 * Two columns of grey pills, each led by a filled tick. The tick is inline
 * rather than a file in /public/icon: there is no check asset in the design
 * exports yet, and inlining lets the disc inherit `currentColor` so it tracks
 * the accent token instead of being locked to whatever colour an SVG was
 * saved with.
 *
 * It is decorative — the list semantics already say these are items, so
 * repeating "included" on every row would only add noise for a screen reader.
 */
export function TextList({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {block.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-4 rounded-xl bg-background-grey p-5 lg:p-6"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="mt-0.5 size-6 shrink-0 text-icon-accent"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" />
              <path
                d="m7 12.4 3.3 3.3L17 9"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-body-xl text-foreground">{item.description}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
