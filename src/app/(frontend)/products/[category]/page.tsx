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
  type SectionBlock,
} from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import { faqPageSchema, jsonLd } from "@/lib/structured-data";
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
 * this, /products/flooring — which the navbar still links to — would invoke a
 * function on every hit only to fail the slug check below.
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
    description: data.description ?? "",
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
