import type { PayloadRequest } from 'payload';

import Link from 'next/link';

/**
 * The last handful of edits across the two collections editors actually work
 * in, newest first.
 *
 * Payload's own list views are per collection, so "what changed here lately"
 * is a question the panel cannot otherwise answer without opening each one in
 * turn.
 */

type WidgetProps = { req: PayloadRequest };

type Row = {
  id: number | string;
  title: string;
  collection: string;
  collectionLabel: string;
  status: string;
  updatedAt: string;
};

/** Both collections are small, so a few rows from each is plenty to merge from. */
const PER_COLLECTION = 6;
const SHOWN = 6;

const formatDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });

export async function RecentActivity({ req }: WidgetProps) {
  const { payload } = req;

  const [events, products] = await Promise.all([
    payload.find({
      collection: 'events',
      sort: '-updatedAt',
      limit: PER_COLLECTION,
      depth: 0,
      req,
    }),
    payload.find({
      collection: 'products',
      sort: '-updatedAt',
      limit: PER_COLLECTION,
      depth: 0,
      req,
    }),
  ]);

  const rows: Row[] = [
    ...events.docs.map((doc) => ({
      id: doc.id,
      title: doc.name,
      collection: 'events',
      collectionLabel: 'Event',
      status: doc._status ?? 'published',
      updatedAt: doc.updatedAt,
    })),
    ...products.docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      collection: 'products',
      collectionLabel: 'Product Card',
      status: doc._status ?? 'published',
      updatedAt: doc.updatedAt,
    })),
  ]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, SHOWN);

  return (
    <section className="dash-card">
      <header className="dash-card__head">
        <h2 className="dash-card__title">Recently Edited</h2>
      </header>

      {rows.length === 0 ? (
        <p className="dash-empty">Nothing has been edited yet.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Where</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.collection}-${row.id}`}>
                <td>
                  <Link
                    className="dash-table__link"
                    href={`/admin/collections/${row.collection}/${row.id}`}
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="dash-table__muted">{row.collectionLabel}</td>
                <td>
                  <span className={`dash-status dash-status--${row.status}`}>
                    {row.status === 'draft' ? 'Draft' : 'Published'}
                  </span>
                </td>
                <td className="dash-table__muted">
                  {formatDate.format(new Date(row.updatedAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
