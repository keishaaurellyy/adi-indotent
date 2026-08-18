/**
 * Helpers untuk memangkas response REST API.
 *
 * Strapi selalu menyertakan field pembukuan (documentId, createdAt,
 * updatedAt, publishedAt) di setiap entry. Frontend tidak memakainya, jadi
 * response dipangkas agar hanya berisi field yang benar-benar ditampilkan.
 */

type Entry = Record<string, unknown>;

type DataResponse = { data: unknown } & Record<string, unknown>;

/**
 * Controller inti bisa menyelesaikan request tanpa mengembalikan body,
 * misalnya lewat `ctx.notFound()`. Response seperti itu harus diteruskan
 * apa adanya, jangan dipangkas — kalau dipaksa, status 404 berubah jadi 500.
 */
const hasData = (response: unknown): response is DataResponse =>
  typeof response === 'object' && response !== null && 'data' in response;

/**
 * Buang `documentId` di kedalaman berapa pun.
 *
 * Field pembukuan sudah hilang di level teratas lewat daftar field, tapi Strapi
 * tetap menyisipkan `documentId` pada object media — dan itu tidak bisa dicegah
 * lewat `populate.fields`. Dibersihkan di sini supaya seluruh response konsisten.
 */
const stripDocumentId = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripDocumentId);

  if (typeof value === 'object' && value !== null) {
    const cleaned: Entry = {};
    for (const [key, nested] of Object.entries(value as Entry)) {
      if (key === 'documentId') continue;
      cleaned[key] = stripDocumentId(nested);
    }
    return cleaned;
  }

  return value;
};

const pick = (entry: unknown, fields: readonly string[]): Entry | null => {
  if (typeof entry !== 'object' || entry === null) return null;
  const source = entry as Entry;
  return Object.fromEntries(
    fields.map((field) => [field, stripDocumentId(source[field] ?? null)])
  );
};

/** Pangkas setiap entry pada response list, `meta` dibiarkan utuh. */
export const trimList = (response: unknown, fields: readonly string[]) => {
  if (!hasData(response) || !Array.isArray(response.data)) return response;

  return { ...response, data: response.data.map((entry) => pick(entry, fields)) };
};

/** Pangkas satu entry (findOne atau single type). */
export const trimSingle = (response: unknown, fields: readonly string[]) => {
  if (!hasData(response)) return response;

  return { ...response, data: pick(response.data, fields) };
};
