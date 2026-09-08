import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  OPENING_HOURS_SPEC,
  PHONE_E164,
  POSTAL_ADDRESS,
} from "./contact";
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, absoluteUrl } from "./site";

/**
 * schema.org LocalBusiness for the company.
 *
 * This is what lets Google tie the site to the Google Business Profile and
 * show the address, hours and phone as a knowledge panel rather than a plain
 * blue link. The name, address and phone here have to match the Business
 * Profile character for character — a mismatch reads as two businesses.
 *
 * `sameAs` is the other half of that: it claims the social profiles as the
 * same entity instead of leaving Google to guess.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    image: absoluteUrl(SITE_OG_IMAGE.url),
    telephone: PHONE_E164,
    address: {
      "@type": "PostalAddress",
      streetAddress: POSTAL_ADDRESS.streetAddress,
      addressLocality: POSTAL_ADDRESS.locality,
      addressRegion: POSTAL_ADDRESS.region,
      postalCode: POSTAL_ADDRESS.postalCode,
      addressCountry: POSTAL_ADDRESS.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...OPENING_HOURS_SPEC.days],
        opens: OPENING_HOURS_SPEC.opens,
        closes: OPENING_HOURS_SPEC.closes,
      },
    ],
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
  };
}

/**
 * Serialises a schema object for a `<script type="application/ld+json">`.
 *
 * The `<` escape stops a literal `</script>` in any string from closing the
 * tag early. Every value here is a module constant today, so this guards
 * against a future edit rather than against user input.
 */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\u003c");
}

/**
 * schema.org FAQPage for a category's `pertanyaan_umum` section.
 *
 * This is the one piece of structured data here that can win extra space in
 * the result itself — Google renders qualifying Q&A pairs as expandable rows
 * under the link. It qualifies only while the answers are visible on the page,
 * which is why the accordion keeps them in the HTML while collapsed rather
 * than fetching them on expand.
 *
 * Answers are plain textarea fields, so they are passed through as-is; if that
 * field ever becomes rich text, this has to serialise to text first, because
 * markup inside `acceptedAnswer.text` is what makes Google drop the result.
 */
export function faqPageSchema(
  url: string,
  items: { question: string; answer: string | null }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer ?? "" },
    })),
  };
}
