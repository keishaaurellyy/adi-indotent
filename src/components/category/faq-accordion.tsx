import { WHATSAPP_URL } from "@/lib/contact";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

/**
 * The phrase an answer uses to point at WhatsApp, linked wherever it appears.
 *
 * `answer` is a plain textarea in Payload, so an editor cannot author a link
 * inside it — the alternative to matching here is converting the field to
 * rich text, which is a schema change, a content migration, and a lexical
 * walk to keep the FAQPage structured data in plain text. Matching one known
 * phrase buys the design's inline link for none of that.
 *
 * The coupling is the cost: reword this phrase in the admin and the link
 * quietly stops appearing. It degrades to plain text rather than breaking,
 * and the raw string is untouched, so the structured data is unaffected
 * either way.
 */
const WHATSAPP_PHRASE = /hubungi kami/i;

/**
 * An answer with its WhatsApp phrase linked, or plain text when it has none.
 * Casing comes from the match, so the admin's wording survives.
 */
function AnswerText({ text }: { text: string }) {
  const match = text.match(WHATSAPP_PHRASE);
  if (match?.index === undefined) return <>{text}</>;

  return (
    <>
      {text.slice(0, match.index)}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {match[0]}
      </a>
      {text.slice(match.index + match[0].length)}
    </>
  );
}

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
 *
 * Rows open by default, as the design shows them: these are four short
 * answers a buyer is expected to read, not a long index to hunt through, and
 * an open row still collapses on click for anyone who wants it out of the way.
 *
 * Full width and unboxed, matching the specifications table — the divider is
 * the only chrome, so the two reference sections read as a pair.
 */
export function FaqAccordion({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="divide-y divide-border border-t border-border">
        {block.items.map((item) => (
          <li key={item.id}>
            <details open className="group py-6 lg:py-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-h6 font-bold text-foreground marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {item.question}
                {/* Points down while collapsed, up once the row is open. */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="size-6 shrink-0 text-foreground transition-transform group-open:-rotate-180"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              {item.answer && (
                <p className="mt-4 text-body-xl text-foreground-secondary">
                  <AnswerText text={item.answer} />
                </p>
              )}
            </details>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
