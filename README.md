# Adi Indotent

Company profile website and content management system for **Adi Indotent**, a tent and event-equipment rental company in Kab. Tangerang, Banten. Visitors browse the tents on offer, see past events, and reach the team on WhatsApp. The staff edit all of it themselves in an admin panel, with no code changes and no redeploys.

Live at **[adi-indotent.com](https://adi-indotent.com)**.

## What's on the site

| Page | Route | Content |
| --- | --- | --- |
| Home | `/` | Hero, the three product cards, why choose us, handled events, trusted solutions |
| Product categories | `/products/roder`, `/products/sarnafil`, `/products/peralatan-pendukung` | Hero, specifications, sizes, use cases, galleries, FAQ, related products |
| Events | `/events` | Past events grouped by category |
| Contact | `/contact` | Address, opening hours, WhatsApp, Instagram, Facebook |

Everything is written in Indonesian (`lang="id"`). Product and event content comes from the CMS. The company details on the contact page and in the structured data live in [`src/lib/contact.ts`](src/lib/contact.ts).

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) with **React 19** and **TypeScript**
- **[Payload CMS 3](https://payloadcms.com)**, running inside the same Next.js app, so there is no separate backend
- **[Tailwind CSS 4](https://tailwindcss.com)** for styling
- **PostgreSQL on [Neon](https://neon.tech)** (Singapore) through `@payloadcms/db-postgres`
- **[Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)** for uploaded media, through `@payloadcms/storage-s3`
- **[Vercel](https://vercel.com)** for hosting, the firewall and Speed Insights

> This project uses a version of Next.js with breaking changes from older releases. Before changing framework-level code, read the relevant guide in `node_modules/next/dist/docs/`. See [`AGENTS.md`](AGENTS.md).

## Getting started

You need Node.js 20 or newer and a Postgres database. A free Neon project works.

```bash
git clone https://github.com/keishaaurellyy/adi-indotent.git
cd adi-indotent
npm install
cp .env.example .env
```

Fill in `.env` (see [Environment variables](#environment-variables)), then:

```bash
npm run seed           # load the starting content (empty databases only)
npm run create-admin   # create your admin account
npm run dev
```

- Site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin>

The first account created with `create-admin` becomes the **superadmin**.

## Environment variables

Copy [`.env.example`](.env.example) to `.env` and fill it in. Every variable is documented there.

Production needs the four `R2_*` variables set. Without them, uploads are saved to the server's disk and are lost on every deploy.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run seed` | Load the starting content. Refuses to run once content exists. |
| `npm run seed:force` | Seed again anyway. Existing entries are skipped, never overwritten. |
| `npm run create-admin` | Create an admin account, with masked password prompts |
| `npm run superadmin -- someone@example.com` | Hand the superadmin role to an existing account |
| `npm run check` | Confirm the database and the Local API are reachable, and count what's in each collection |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing a collection or global |
| `npm run generate:importmap` | Regenerate the admin import map after adding a custom admin component |

## The admin panel

Editors sign in at `/admin`. It is set up for non-technical staff:

- **Dashboard** with live counts, recent activity, events by category and shortcuts to the category pages
- **Content**: Product Cards, Events, Media Library
- **Category Pages**: one editable page each for Roder, Sarnafil and Peralatan Pendukung, organised into tabs and collapsible sections
- **Draft / Publish** on products, events and category pages. Drafts stay private until published.
- **Roles**: exactly one **superadmin**, who alone can manage accounts. Everyone else is an **admin** with full control of the content.
- **Settings menu** (gear icon in the sidebar) for the admin theme and resetting preferences

The API, Versions and Edit tabs are hidden on purpose, to keep the panel simple.

## Content model

| Type | Slug | Notes |
| --- | --- | --- |
| Collection | `products` | The three cards on the home page and in the navbar. Each links to a category page. |
| Collection | `events` | Past events with a photo, location, duration and category |
| Collection | `media` | Images, video, audio and PDFs, with alt text |
| Collection | `users` | Admin accounts and roles |
| Global | `roder`, `sarnafil`, `peralatan-pendukung` | One full category page each |

For field-by-field shapes, query examples and TypeScript types, see [`API.md`](API.md) (in Indonesian). The frontend reads data through Payload's **Local API**, a direct server-side database call with no HTTP round trip.

## Project structure

```
src/
├── app/
│   ├── (frontend)/     Public site: home, events, contact, products/[category]
│   ├── (payload)/      Admin panel, REST and GraphQL routes, admin styles
│   ├── robots.ts       /robots.txt
│   └── sitemap.ts      /sitemap.xml
├── collections/        Payload collections: Products, Events, Media, Users
├── globals/            Payload globals: Roder, Sarnafil, PeralatanPendukung
├── fields/             Shared field definitions for the category pages
├── components/
│   ├── admin/          Custom admin UI: dashboard widgets, nav, settings menu
│   ├── category/       Category-page sections (specs, FAQ, galleries, ...)
│   ├── sections/       Home-page sections
│   ├── layout/         Navbar and footer
│   └── ui/             Shared building blocks (button, card, container, ...)
├── lib/                Data access, site config, metadata, structured data
└── payload.config.ts   Payload configuration
scripts/                seed, create-admin, superadmin, check
```

## SEO

- **Metadata**: every page has a title in the form `Page - Adi Indotent`, a description, a canonical URL, Open Graph and Twitter tags
- **Structured data**: a `LocalBusiness` record on every page and `FAQPage` markup on the category pages
- **`sitemap.xml` and `robots.txt`**: generated from the same category list that drives the routes
- **Previews are hidden**: Vercel preview deployments, including staging, are `noindex` and disallowed in `robots.txt`, so they can't compete with the live site in search

## Deployment

The site deploys to Vercel from GitHub.

- `main` deploys to production at [adi-indotent.com](https://adi-indotent.com)
- `staging` and pull requests get preview deployments
- Set the variables from `.env.example` in the Vercel project. In production, set the four R2 variables, or uploads will be lost on the next deploy.
- **Function region**: the database is in Singapore, so set the project's function region to Singapore (`sin1`) under Settings > Functions. Vercel's default is Washington DC, which adds a trip across the Pacific to every query.
- **Login protection**: a Vercel Firewall rule rate-limits `POST /api/users/login`, the request the admin login form sends
- **Speed Insights** is included in the public layout and shows up in the Vercel dashboard once enabled there

## Workflow

Work happens on short-lived branches (`feat/...`, `fix/...`, `chore/...`) and goes into `main` through a pull request. `staging` is then updated from `main`.
