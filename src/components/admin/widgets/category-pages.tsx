import type { PayloadRequest } from 'payload';

import Link from 'next/link';

import type { PeralatanPendukung, Roder, Sarnafil } from '@/payload-types';

/**
 * Shortcuts to the three category globals.
 *
 * Payload's own dashboard lists collections only, so without this the pages an
 * editor edits most often — Roder, Sarnafil, Peralatan Pendukung — are reachable
 * from the sidebar and nowhere else. Each one shows how many sections currently
 * have content, which is the quickest read on whether a page is finished.
 */

type WidgetProps = { req: PayloadRequest };

const PAGES = [
  { slug: 'roder', label: 'Roder', path: '/products/roder' },
  { slug: 'sarnafil', label: 'Sarnafil', path: '/products/sarnafil' },
  {
    slug: 'peralatan-pendukung',
    label: 'Peralatan Pendukung',
    path: '/products/peralatan-pendukung',
  },
] as const;

type CategoryGlobal = PeralatanPendukung | Roder | Sarnafil;

/** A section counts as filled once it has at least one row. */
function countFilledSections(doc: CategoryGlobal): { filled: number; total: number } {
  // Peralatan Pendukung is shaped differently from the other two: no section
  // groups, just one top-level array of equipment groups. Narrowing on the
  // field rather than on the slug keeps the two branches type-checked.
  if ('equipment_groups' in doc) {
    const groups = doc.equipment_groups ?? [];
    return { filled: groups.length, total: groups.length };
  }

  // Every remaining section is a group holding an `items` array, so they can be
  // counted without naming each one — a section added to a global is picked up
  // here on its own.
  const sections = Object.values(doc).filter(
    (value): value is { items?: unknown[] | null } =>
      typeof value === 'object' && value !== null && 'items' in value
  );

  return {
    filled: sections.filter((section) => (section.items ?? []).length > 0).length,
    total: sections.length,
  };
}

export async function CategoryPages({ req }: WidgetProps) {
  const { payload } = req;

  const pages = await Promise.all(
    PAGES.map(async (page) => {
      const doc = await payload.findGlobal({ slug: page.slug, depth: 0, req });
      return { ...page, ...countFilledSections(doc) };
    })
  );

  return (
    <section className="dash-card">
      <header className="dash-card__head">
        <h2 className="dash-card__title">Category Pages</h2>
      </header>

      <ul className="dash-links">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link className="dash-links__item" href={`/admin/globals/${page.slug}`}>
              <span className="dash-links__label">{page.label}</span>
              <span className="dash-links__meta">
                {page.slug === 'peralatan-pendukung'
                  ? `${page.filled} equipment ${page.filled === 1 ? 'group' : 'groups'}`
                  : `${page.filled} of ${page.total} sections filled`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
