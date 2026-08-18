/**
 * Pembatasan field untuk gambar.
 *
 * Object media bawaan Strapi sangat panjang: `formats` (thumbnail/small/
 * medium/large, masing-masing dengan url, hash, ext, mime, size), ditambah
 * `hash`, `ext`, `mime`, `size`, `provider`, `folderPath`, dan timestamp.
 * Frontend hanya butuh URL, teks alternatif, dan dimensi.
 *
 * Dibatasi lewat `populate.fields` (bukan dipangkas setelah query) supaya
 * kolom yang tidak dipakai memang tidak ikut diambil dari database.
 *
 * Catatan: karena `width`/`height` tidak dikirim, `next/image` perlu dipakai
 * dengan prop `fill` (plus wadah ber-`position: relative`), atau `width`/
 * `height` ditetapkan manual di frontend.
 */
export const MEDIA_FIELDS = ['url', 'alternativeText'];

/** Dipakai pada `populate` untuk field media. */
export const MEDIA_POPULATE = { fields: MEDIA_FIELDS };

/** Dipakai untuk field media di dalam item component. */
export const ITEMS_WITH_IMAGE = {
  populate: { items: { populate: { image: MEDIA_POPULATE } } },
};
