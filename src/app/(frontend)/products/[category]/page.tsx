import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/category/category-hero";
import { CategorySections } from "@/components/category/category-sections";
import { RelatedProducts } from "@/components/category/related-products";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  CATEGORY_SLUGS,
  getCategory,
  isCategorySlug,
  type CategorySlug,
  type SectionBlock,
} from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import {
  breadcrumbSchema,
  faqPageSchema,
  jsonLd,
  serviceSchema,
} from "@/lib/structured-data";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ category: string }> };

/**
 * The three categories are Payload globals, not a collection — there is no
 * `find` across them and no way for editors to add a fourth without a code
 * change — so the full set is known at build time and every page is
 * prerendered.
 */
export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

/**
 * Anything outside that set 404s instead of being rendered on demand. Without
 * this, a stale link such as /products/flooring would invoke a function on
 * every hit only to fail the slug check below.
 */
export const dynamicParams = false;

/** Same five-minute window as the other CMS-driven pages. */
export const revalidate = 300;

/**
 * A valid slug always has a global behind it, so a null here means the CMS
 * read failed rather than that the category is missing. Throwing fails the
 * build loudly instead of baking a 404 into the deployment; on revalidation
 * Next keeps serving the last good version, so a runtime blip stays invisible.
 */
async function loadCategory(slug: string) {
  if (!isCategorySlug(slug)) notFound();

  const category = await getCategory(slug);
  if (!category) {
    throw new Error(`Payload returned no content for category "${slug}"`);
  }
  return category;
}

const isFaq = (
  block: SectionBlock
): block is Extract<SectionBlock, { kind: "faq" }> => block.kind === "faq";

/**
 * The search-result snippet for each category, kept apart from the CMS intro.
 *
 * The intro is the paragraph under the heading and runs past the ~160
 * characters a result shows, so reusing it meant a cut-off snippet, and
 * shortening it meant rewriting copy on the page. These live in code rather
 * than a CMS field because a new Payload field needs a schema change on the
 * production database, and the repo has no migrations.
 */
const META_DESCRIPTIONS: Record<CategorySlug, string> = {
  roder:
    "Sewa tenda Roder bentang 5m - 25m: rangka besi/aluminium, atap PVC tahan cuaca, bebas tiang tengah. Untuk hajatan, bazar, pameran, hingga kebutuhan darurat.",
  sarnafil:
    "Sewa tenda Sarnafil 3x3 dan 5x5 dengan atap membran PVC kedap air dan tahan panas. Tanpa tiang tengah dan kokoh untuk berbagai acara outdoor.",
  "peralatan-pendukung":
    "Sewa kursi, meja, AC, dan misty fan untuk melengkapi acara: tempat duduk tamu, meja penyajian, hingga sirkulasi udara yang sejuk.",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await loadCategory(category);

  return pageMetadata({
    // Straight from the CMS, so editors control it. Renaming the global's
    // title to "Tenda Roder" in the admin improves the heading, the tab title
    // and the shared-link title together, with no code change.
    title: data.title,
    description: META_DESCRIPTIONS[data.slug],
    path: `/products/${data.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  // Both reads hit the same Payload instance, so they overlap rather than
  // queueing. The products list is the page's outro and degrades to an empty
  // array on its own, so it is not part of loadCategory's throw-on-failure.
  const [data, products] = await Promise.all([
    loadCategory(category),
    getProducts(),
  ]);
  const otherProducts = products.filter((p) => p.href !== `/products/${category}`);

  const faq = data.blocks.find(isFaq);
  const url = absoluteUrl(`/products/${data.slug}`);

  return (
    <>
      <Navbar tone="light" />

      <CategoryHero
        title={data.title}
        description={data.description}
        image={data.heroImage}
      />

      <CategorySections blocks={data.blocks} />

      <RelatedProducts items={otherProducts} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            breadcrumbSchema(url, data.title),
            serviceSchema(url, data.title, META_DESCRIPTIONS[data.slug]),
          ]),
        }}
      />

      {faq && (
        <script
          type="application/ld+json"
          // Emitted only when the section actually rendered: structured data
          // describing questions absent from the page is a manual-action risk,
          // not just a wasted tag.
          dangerouslySetInnerHTML={{
            __html: jsonLd(faqPageSchema(url, faq.items)),
          }}
        />
      )}

      <SiteFooter />
    </>
  );
}
