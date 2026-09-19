import type { PayloadRequest } from 'payload';

import Link from 'next/link';

/**
 * How the events break down by category.
 *
 * Bars rather than a line: there are thirteen events, all created in one seed
 * run, so anything plotted against time would be a single spike pretending to
 * be a trend. Category is the one dimension this data actually varies on.
 *
 * Drawn with plain elements — a chart library would be a large dependency for
 * six bars, and these need to restyle with the theme like everything else.
 */

type WidgetProps = { req: PayloadRequest };

/** Mirrors the select in src/collections/Events.ts, including the display order. */
const CATEGORY_LABELS: Record<string, string> = {
  korporat: 'Korporat',
  pemerintahan: 'Pemerintahan',
  keagamaan: 'Keagamaan',
  festival: 'Festival',
  bazaar: 'Bazaar',
  wedding: 'Wedding',
  komunitas: 'Komunitas',
};

const UNCATEGORISED = 'No category';

export async function EventsByCategory({ req }: WidgetProps) {
  const { payload } = req;

  const { docs, totalDocs } = await payload.find({
    collection: 'events',
    // Well above the 13 that exist; the collection is small enough to tally in
    // memory rather than running one count query per category.
    limit: 500,
    depth: 0,
    req,
  });

  const tally = new Map<string, number>();
  for (const doc of docs) {
    const key = typeof doc.event_category === 'string' ? doc.event_category : UNCATEGORISED;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }

  // Every category in the select appears, including the ones sitting at zero —
  // an empty bar is information, and hiding it makes the list look complete
  // when it is not.
  const rows = [
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      label,
      count: tally.get(value) ?? 0,
      href: `/admin/collections/events?where[event_category][equals]=${value}`,
    })),
    ...(tally.has(UNCATEGORISED)
      ? [
          {
            label: UNCATEGORISED,
            count: tally.get(UNCATEGORISED) ?? 0,
            href: '/admin/collections/events',
          },
        ]
      : []),
  ].sort((a, b) => b.count - a.count);

  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <section className="dash-card">
      <header className="dash-card__head">
        <h2 className="dash-card__title">Events by Category</h2>
        <span className="dash-card__meta">{totalDocs} total</span>
      </header>

      {totalDocs === 0 ? (
        <p className="dash-empty">No events yet.</p>
      ) : (
        <ul className="dash-bars">
          {rows.map((row) => (
            <li className="dash-bars__row" key={row.label}>
              <Link className="dash-bars__label" href={row.href}>
                {row.label}
              </Link>
              <span className="dash-bars__track">
                <span
                  className="dash-bars__fill"
                  // The only value that cannot come from a stylesheet: it is
                  // derived per row from the counts above.
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </span>
              <span className="dash-bars__count">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
