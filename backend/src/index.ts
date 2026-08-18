import type { Core, UID } from '@strapi/strapi';
import { events, peralatanPendukung, products, roder, sarnafil } from './seed-data';

// Public (unauthenticated) read actions for the dynamic content APIs
// consumed by the website's home, product, and events sections.
const PUBLIC_READ_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::event.event.find',
  'api::event.event.findOne',
  // Single types only expose `find`.
  'api::roder.roder.find',
  'api::sarnafil.sarnafil.find',
  'api::peralatan-pendukung.peralatan-pendukung.find',
];

async function grantPublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_READ_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

/**
 * Role admin untuk pengelola konten.
 *
 * Boleh mengelola Events dan ketiga halaman kategori produk, TAPI tidak punya
 * akses sama sekali ke content type "Product" — kartu produk di home hanya
 * boleh diubah oleh Super Admin.
 *
 * Dibuat lewat bootstrap (bukan manual di panel) supaya ikut ter-commit dan
 * otomatis ada lagi saat deploy ke database baru.
 */
const CONTENT_EDITOR_ROLE = {
  name: 'Editor Konten',
  description:
    'Mengelola Events dan halaman kategori produk (Roder, Sarnafil, Peralatan Pendukung). Tidak memiliki akses ke Product.',
};

// Content type yang boleh disentuh role di atas. "api::product.product"
// sengaja TIDAK ada di sini.
const CONTENT_EDITOR_SUBJECTS = [
  'api::event.event',
  'api::roder.roder',
  'api::sarnafil.sarnafil',
  'api::peralatan-pendukung.peralatan-pendukung',
];

// Tanpa akses Media Library, editor tidak bisa mengunggah gambar.
const MEDIA_LIBRARY_ACTIONS = [
  'plugin::upload.read',
  'plugin::upload.configure-view',
  'plugin::upload.assets.create',
  'plugin::upload.assets.update',
  'plugin::upload.assets.download',
  'plugin::upload.assets.copy-link',
];

async function ensureContentEditorRole(strapi: Core.Strapi) {
  const roleService = strapi.service('admin::role');

  const existing = await strapi.db
    .query('admin::role')
    .findOne({ where: { name: CONTENT_EDITOR_ROLE.name } });

  // Jangan sentuh role yang sudah ada — permission-nya mungkin sudah
  // disesuaikan manual lewat admin panel.
  if (existing) return;

  const role = await roleService.create(CONTENT_EDITOR_ROLE);
  const superAdmin = await roleService.getSuperAdmin();

  if (!superAdmin) return;

  // Cerminkan permission Super Admin, tapi hanya untuk subject yang diizinkan.
  // Dengan begitu daftar field-nya otomatis ikut kalau skema berubah.
  const sourcePermissions = await strapi.db.query('admin::permission').findMany({
    where: { role: superAdmin.id, subject: CONTENT_EDITOR_SUBJECTS },
  });

  const contentPermissions = sourcePermissions.map((permission) => ({
    action: permission.action,
    subject: permission.subject,
    properties: permission.properties ?? {},
    conditions: permission.conditions ?? [],
  }));

  const mediaPermissions = MEDIA_LIBRARY_ACTIONS.map((action) => ({
    action,
    subject: null,
    properties: {},
    conditions: [],
  }));

  await roleService.assignPermissions(role.id, [...contentPermissions, ...mediaPermissions]);

  strapi.log.info(
    `[rbac] Role "${CONTENT_EDITOR_ROLE.name}" dibuat dengan ${contentPermissions.length} permission konten.`
  );
}

type SeedEntry = Record<string, unknown>;

// Seeds are keyed on a unique field so restarts stay idempotent and never
// clobber content edited through the admin panel.
async function seedCollection(
  strapi: Core.Strapi,
  uid: UID.ContentType,
  entries: SeedEntry[],
  keyField: string
) {
  for (const entry of entries) {
    const [existing] = await strapi.documents(uid).findMany({
      filters: { [keyField]: entry[keyField] },
      status: 'published',
      limit: 1,
    });

    if (!existing) {
      await strapi.documents(uid).create({ data: entry, status: 'published' });
    }
  }
}

async function seedSingleType(strapi: Core.Strapi, uid: UID.ContentType, data: SeedEntry) {
  const existing = await strapi.documents(uid).findFirst({ status: 'published' });

  if (!existing) {
    await strapi.documents(uid).create({ data, status: 'published' });
  }
}

async function seedContent(strapi: Core.Strapi) {
  await seedCollection(strapi, 'api::product.product', products, 'category_key');
  await seedCollection(strapi, 'api::event.event', events, 'name');

  await seedSingleType(strapi, 'api::roder.roder', roder);
  await seedSingleType(strapi, 'api::sarnafil.sarnafil', sarnafil);
  await seedSingleType(
    strapi,
    'api::peralatan-pendukung.peralatan-pendukung',
    peralatanPendukung
  );
}

const strapiHooks = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadPermissions(strapi);
    await ensureContentEditorRole(strapi);
    await seedContent(strapi);
  },
};

export default strapiHooks;
