import type { Access, ClientUser, CollectionConfig, FieldAccess, TypedUser } from 'payload';

import { APIError } from 'payload';

import { hideDocTabs } from '../lib/admin-views';

/*
 * Two roles, and the whole rule is one sentence: there is exactly one
 * superadmin, and they are the only person who can see or change who is able
 * to sign in. Everyone else is an "admin" — full run of the content, no access
 * to this collection.
 *
 * The roles are a fixed pair rather than a permissions matrix on purpose. A
 * company this size has one person who owns the accounts and a handful of
 * people who edit the site; anything finer would be settings nobody ever
 * changes, and every extra role is another combination to get wrong.
 */

/**
 * Takes a user from either side of the panel: the full document on `req.user`
 * on the server, and the trimmed `ClientUser` the admin UI passes to
 * `admin.hidden`.
 */
export const isSuperadmin = (user: ClientUser | null | TypedUser | undefined): boolean =>
  user?.role === 'superadmin';

const superadminOnly: Access = ({ req }) => isSuperadmin(req.user);

const superadminOnlyField: FieldAccess = ({ req }) => isSuperadmin(req.user);

/**
 * The superadmin sees every account; everyone else sees exactly one — their
 * own. Returning a filter rather than `false` is what keeps /admin/account
 * working: that page loads the signed-in user through this same access rule,
 * so a flat denial would lock an admin out of their own password.
 */
const superadminOrSelf: Access = ({ req: { user } }) => {
  if (isSuperadmin(user)) return true;
  if (!user) return false;
  return { id: { equals: user.id } };
};

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    hideAPIURL: true,
    components: hideDocTabs,
    // `email` rather than `name`, because name is optional and a user who
    // never filled it in would show up as "Untitled" everywhere.
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    group: 'Settings',
    description: 'People who can sign in and edit this site.',
    // Takes the whole Settings group out of the sidebar for a plain admin —
    // Users is the only thing in it. This hides the door; `access` below is
    // what actually locks it.
    hidden: ({ user }) => !isSuperadmin(user),
  },
  auth: true,
  access: {
    create: superadminOnly,
    delete: superadminOnly,
    read: superadminOrSelf,
    update: superadminOrSelf,
  },
  hooks: {
    /*
     * "Exactly one superadmin" enforced at the only two places it can break.
     * These run on every route into the database — admin panel, REST, GraphQL
     * and the Local API alike — so there is no way in that skips them.
     */
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const previousRole = originalDoc?.role;
        // A partial update leaves `role` out entirely; that means unchanged,
        // not "clear it".
        const nextRole = data.role ?? previousRole;

        if (nextRole === 'superadmin' && previousRole !== 'superadmin') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'superadmin' } },
            req,
          });

          if (totalDocs > 0) {
            throw new APIError(
              'There is already a superadmin. Demote that account first, or run "npm run superadmin" to move the role.',
              400
            );
          }
        }

        if (previousRole === 'superadmin' && nextRole !== 'superadmin') {
          throw new APIError(
            'The superadmin cannot be demoted — the site would be left with nobody who can manage users. Run "npm run superadmin" to hand the role to someone else.',
            400
          );
        }

        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = await req.payload.findByID({
          collection: 'users',
          id,
          depth: 0,
          req,
        });

        if (doc?.role === 'superadmin') {
          throw new APIError(
            'The superadmin account cannot be deleted. Hand the role to someone else first with "npm run superadmin".',
            400
          );
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      admin: { description: 'Shown instead of the email address where there is room for it.' },
    },
    {
      name: 'role',
      label: 'Role',
      // Radio rather than select: two options, both of which someone picking a
      // role needs to weigh against each other. A dropdown hides the
      // alternative behind a click; radios put the choice on the page.
      // Postgres does not care either way — Payload maps radio and select to
      // the same enum column, so this changes nothing in the database.
      type: 'radio',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Superadmin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
      ],
      // Without this a plain admin could promote themselves from their own
      // account page. Payload strips the field from the request instead of
      // failing, so the rest of the save still goes through.
      access: {
        create: superadminOnlyField,
        update: superadminOnlyField,
      },
      admin: {
        description:
          'Admins edit all of the site content. The superadmin does that and manages this list of users — there can only be one.',
      },
    },
  ],
};
