/**
 * Menyelaraskan urutan field pada response REST dengan layout
 * "Configure the view" di Content Manager.
 *
 * Dengan begini admin cukup menyusun ulang field di admin panel, dan urutan
 * data yang diterima frontend ikut berubah tanpa perlu ubah kode.
 */

import type { Core, UID } from '@strapi/strapi';

type LayoutField = { name?: unknown };

const isLayoutField = (value: unknown): value is LayoutField =>
  typeof value === 'object' && value !== null;

/**
 * Konfigurasi layout tersimpan di database, jadi tanpa cache setiap request
 * publik menambah satu query. Layout jarang berubah, jadi hasilnya ditahan
 * sebentar. Konsekuensinya: setelah admin menyusun ulang field, urutan baru
 * muncul paling lama 30 detik kemudian.
 */
const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { fields: readonly string[]; expiresAt: number }>();

/** Ambil nama field dari `layouts.edit` (array baris, tiap baris array field). */
const readEditLayout = (configuration: unknown): string[] => {
  if (typeof configuration !== 'object' || configuration === null) return [];

  const layouts = (configuration as { layouts?: unknown }).layouts;
  if (typeof layouts !== 'object' || layouts === null) return [];

  const edit = (layouts as { edit?: unknown }).edit;
  if (!Array.isArray(edit)) return [];

  return edit
    .flat()
    .filter(isLayoutField)
    .map((field) => field.name)
    .filter((name): name is string => typeof name === 'string');
};

/**
 * Urutkan `allowedFields` mengikuti layout Content Manager.
 *
 * `allowedFields` tetap menjadi penentu field mana yang boleh keluar — layout
 * hanya mengatur urutannya. Field yang belum ada di layout tidak dibuang,
 * melainkan ditempatkan di akhir, supaya tidak ada data yang hilang diam-diam.
 * Kalau konfigurasi tidak terbaca, urutan bawaan dipakai apa adanya.
 */
export async function orderFieldsByLayout(
  strapi: Core.Strapi,
  uid: UID.ContentType,
  allowedFields: readonly string[]
): Promise<readonly string[]> {
  const cached = cache.get(uid);
  if (cached && cached.expiresAt > Date.now()) return cached.fields;

  try {
    const configuration = await strapi
      .plugin('content-manager')
      .service('content-types')
      .findConfiguration(strapi.contentType(uid));

    const layoutOrder = readEditLayout(configuration);
    if (layoutOrder.length === 0) {
      strapi.log.warn(`[layout] ${uid}: layouts.edit kosong, pakai urutan bawaan.`);
      return allowedFields;
    }

    const allowed = new Set(allowedFields);
    const ordered = layoutOrder.filter((name) => allowed.has(name));

    if (ordered.length === 0) {
      strapi.log.warn(`[layout] ${uid}: tidak ada field layout yang cocok, pakai urutan bawaan.`);
      return allowedFields;
    }

    const placed = new Set(ordered);
    const leftover = allowedFields.filter((name) => !placed.has(name) && name !== 'id');
    const fields = allowed.has('id')
      ? ['id', ...ordered, ...leftover]
      : [...ordered, ...leftover];

    cache.set(uid, { fields, expiresAt: Date.now() + CACHE_TTL_MS });
    return fields;
  } catch (error) {
    // Konfigurasi belum tersimpan atau plugin tidak tersedia — pakai urutan bawaan,
    // tapi jangan dibiarkan senyap supaya penyebabnya kelihatan.
    strapi.log.warn(
      `[layout] ${uid}: gagal membaca konfigurasi Content Manager (${
        error instanceof Error ? error.message : String(error)
      }). Pakai urutan bawaan.`
    );
    return allowedFields;
  }
}
