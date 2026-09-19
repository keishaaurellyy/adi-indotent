import type { PayloadRequest } from 'payload';

import Link from 'next/link';

import { isSuperadmin } from '@/collections/Users';

/**
 * The counts row at the top of the dashboard.
 *
 * Every number here is queried, never estimated, and every card says something
 * an editor can act on. "Missing alt text" earns its place for that reason: it
 * is the one stat that turns into a task.
 *
 * Widgets are server components rendered on demand, and Payload hands them the
 * request rather than the Payload instance — `req` is passed down into each
 * query so they share its transaction.
 */

type WidgetProps = { req: PayloadRequest };

type Stat = {
  label: string;
  value: number;
  href: string;
  /** Reads under the number. */
  note: string;
  /** Draws the note as a warning rather than plain text. */
  needsAttention?: boolean;
};

export async function AtAGlance({ req }: WidgetProps) {
  const { payload } = req;
  const showUsers = isSuperadmin(req.user);

  const [products, events, publishedEvents, media, mediaMissingAlt, users] = await Promise.all([
    payload.count({ collection: 'products', req }),
    payload.count({ collection: 'events', req }),
    payload.count({ collection: 'events', where: { _status: { equals: 'published' } }, req }),
    payload.count({ collection: 'media', req }),
    payload.count({
      collection: 'media',
      // Both shapes count as missing: a row that never had alt text, and one
      // where an editor saved the field empty.
      where: { or: [{ alt: { exists: false } }, { alt: { equals: '' } }] },
      req,
    }),
    // Skipped entirely for a plain admin — the card it feeds is not shown.
    showUsers ? payload.count({ collection: 'users', req }) : null,
  ]);

  const drafts = events.totalDocs - publishedEvents.totalDocs;

  const stats: Stat[] = [
    {
      label: 'Product Cards',
      value: products.totalDocs,
      href: '/admin/collections/products',
      note: 'One per category page',
    },
    {
      label: 'Events',
      value: events.totalDocs,
      href: '/admin/collections/events',
      note: drafts > 0 ? `${publishedEvents.totalDocs} live · ${drafts} in draft` : 'All published',
      needsAttention: drafts > 0,
    },
    {
      label: 'Media Files',
      value: media.totalDocs,
      href: '/admin/collections/media',
      note:
        mediaMissingAlt.totalDocs > 0
          ? `${mediaMissingAlt.totalDocs} missing alt text`
          : 'All have alt text',
      needsAttention: mediaMissingAlt.totalDocs > 0,
    },
  ];

  /*
   * Users is the superadmin's card. A plain admin cannot open that collection,
   * so the number would only be a link into a page that turns them away.
   */
  if (users) {
    stats.push({
      label: 'Users',
      value: users.totalDocs,
      href: '/admin/collections/users',
      note: users.totalDocs === 1 ? 'One person can sign in' : 'People who can sign in',
    });
  }

  return (
    <div className="dash-stats">
      {stats.map((stat) => (
        <Link className="dash-stat" href={stat.href} key={stat.label}>
          <span className="dash-stat__label">{stat.label}</span>
          <span className="dash-stat__value">{stat.value}</span>
          <span
            className={
              stat.needsAttention ? 'dash-stat__note dash-stat__note--attention' : 'dash-stat__note'
            }
          >
            {stat.note}
          </span>
        </Link>
      ))}
    </div>
  );
}
