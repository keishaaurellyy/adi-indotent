# API Reference — Adi Indotent

Panduan untuk tim frontend. Semua endpoint **publik** (tanpa token), **read-only** (GET), JSON.

```
Base URL (development): http://localhost:1337
```

**Daftar endpoint**

| # | Endpoint | Dipakai untuk |
|---|---|---|
| [1](#1-get-apiproducts) | `GET /api/products` | Products Overview (home) + submenu navbar |
| [2](#2-get-apievents) | `GET /api/events` | Section Events (home) + halaman Events |
| [3](#3-get-apiroder) | `GET /api/roder` | Halaman detail kategori Roder |
| [4](#4-get-apisarnafil) | `GET /api/sarnafil` | Halaman detail kategori Sarnafil |
| [5](#5-get-apiperalatan-pendukung) | `GET /api/peralatan-pendukung` | Halaman detail kategori Peralatan Pendukung |

Section **statis** (Landing, Company Background, Why Us, Contact & Address) tidak punya API — konten di-hardcode di frontend.

**Yang perlu diketahui sebelum mulai:**

1. Tidak perlu `?populate=*` — relasi & gambar sudah otomatis ikut.
2. Response sudah bersih — `documentId`, `createdAt`, `updatedAt`, `publishedAt` sudah dibuang.
3. Semua response dibungkus `{ "data": ... }`. Endpoint list punya `meta.pagination`, endpoint kategori tidak.

---

# 1. `GET /api/products`

Daftar kartu kategori di home. Dari sini frontend mendapat `category_key` untuk membuka halaman detail.

### Query parameters

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `sort` | string | `display_order:asc` | Sudah diurutkan server. Isi sendiri hanya jika perlu urutan lain. |
| `pagination[pageSize]` | number | `25` | Maksimum `100`. Total data cuma 3, jadi tidak perlu diisi. |
| `pagination[page]` | number | `1` | Nomor halaman. |
| `filters[...]` | object | — | Format filter Strapi, mis. `filters[category_key][$eq]=roder`. |

### Contoh request

```bash
curl "http://localhost:1337/api/products"
```

### Response `200`

```json
{
  "data": [
    {
      "id": 18,
      "description": "Tenda Roder tersedia dalam berbagai ukuran, mulai dari 10m hingga 25m.",
      "image": null,
      "display_order": 1,
      "title": "Roder",
      "category_key": "roder"
    },
    {
      "id": 20,
      "description": "Atap membran PVC berkualitas tinggi dirancang khusus untuk menghadapi kondisi cuaca outdoor, kedap air, tahan sinar UV, dan tetap kokoh dalam pemakaian jangka panjang untuk berbagai jenis acara.",
      "image": null,
      "display_order": 2,
      "title": "Sarnafil",
      "category_key": "sarnafil"
    },
    {
      "id": 22,
      "description": "Kursi, meja, AC, dan misty fan yang kami sediakan siap melengkapi kenyamanan acara, mulai dari tempat duduk, penyajian, hingga sirkulasi udara yang sejuk sepanjang acara berlangsung.",
      "image": null,
      "display_order": 3,
      "title": "Peralatan Pendukung",
      "category_key": "peralatan-pendukung"
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 3 }
  }
}
```

### Penjelasan field

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | number | ID internal. |
| `title` | string | Nama kategori. |
| `description` | string \| null | Teks singkat di kartu. |
| `image` | [Media](#tipe-media) \| null | Foto kartu. Masih `null` (belum ada upload). |
| `category_key` | enum | `roder` · `sarnafil` · `peralatan-pendukung` |
| `display_order` | number | Urutan tampil. |

### Alur navigasi

`category_key` sengaja dibuat **identik dengan path endpoint detailnya**, jadi tidak perlu bikin tabel mapping:

```
GET /api/products  →  { category_key: "roder" }
                                  │
                    klik kartu ───┘
                                  ▼
                       GET /api/roder
```

```ts
// route: /products/[slug]
const res = await fetch(`${BASE}/api/${params.slug}`);
```

---

# 2. `GET /api/events`

Daftar event. Sudah diurutkan `display_order` naik.

### Query parameters

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `filters[is_featured][$eq]` | boolean | — | `true` untuk 3 event unggulan di home. |
| `filters[event_category][$eq]` | enum | — | Saring per kategori. |
| `pagination[pageSize]` | number | `25` | **Maksimum `100`.** Total 11 event, jadi `100` cukup untuk ambil semua. |
| `pagination[page]` | number | `1` | Nomor halaman. |
| `sort` | string | `display_order:asc` | Sudah diurutkan server. |

Nilai `event_category` yang valid:
`korporat` · `pemerintahan` · `keagamaan` · `pendidikan` · `festival` · `komersial` · `gathering`

### Contoh request

```bash
# Home — 3 event unggulan
curl "http://localhost:1337/api/events?filters[is_featured][\$eq]=true"

# Halaman Events — semua
curl "http://localhost:1337/api/events?pagination[pageSize]=100"

# Saring per kategori
curl "http://localhost:1337/api/events?filters[event_category][\$eq]=keagamaan"
```

> Di shell, `$` pada `[$eq]` perlu di-escape. Di JavaScript tidak perlu.

### Response `200`

```json
{
  "data": [
    {
      "id": 2,
      "name": "Aeon Mall Cikarang",
      "image": null,
      "event_category": "komersial",
      "location": "Cikarang",
      "duration": "3 hari",
      "is_featured": true,
      "display_order": 1
    },
    {
      "id": 4,
      "name": "Alun-alun Cilegon",
      "image": null,
      "event_category": "pemerintahan",
      "location": "Cilegon",
      "duration": "3 hari",
      "is_featured": true,
      "display_order": 2
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 11 }
  }
}
```

### Penjelasan field

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | number | ID internal. |
| `name` | string | Nama event. |
| `image` | [Media](#tipe-media) \| null | Foto event. |
| `event_category` | enum \| null | Label kategori di kartu. |
| `location` | string \| null | Kota / lokasi. |
| `duration` | string \| null | Teks bebas, mis. `"3 hari"`. |
| `is_featured` | boolean | `true` = tampil di home. |
| `display_order` | number | Urutan tampil. |

---

# Halaman kategori (endpoint 3–5)

Ketiganya **single type**: `data` berupa **objek tunggal**, bukan array, dan **tidak ada** `meta.pagination`.

**Tidak menerima query parameter apa pun** — tidak ada filter, sort, maupun pagination. Cukup panggil URL-nya.

### Pola section

Semua section berbentuk sama: `group_name` sebagai judul, `items` sebagai isinya.

```json
"use_cases": {
  "id": 29,
  "group_name": "Cocok untuk Berbagai Acara",
  "items": [ /* ... */ ]
}
```

> **`group_name` datang dari CMS — jangan hardcode judul section di frontend.**

### Bentuk `items` berbeda tiap section

| Section | Bentuk item | Roder | Sarnafil |
|---|---|:---:|:---:|
| `use_cases` | `{ id, name, description }` | ✓ | ✓ |
| `jenis_roder` | `{ id, name, image }` | ✓ | — |
| `pilihan_dinding` | `{ id, name, description, image }` | ✓ | — |
| `size_variants` | `{ id, name, image }` | ✓ | ✓ |
| `yang_anda_dapatkan` | `{ id, description }` | ✓ | ✓ |
| `flooring_modul` | `{ id, image }` + section punya `description` | ✓ | ✓ |
| `specifications` | `{ id, label, value }` | ✓ | ✓ |
| `pertanyaan_umum` | `{ id, question, answer }` | ✓ | ✓ |

---

# 3. `GET /api/roder`

### Contoh request

```bash
curl "http://localhost:1337/api/roder"
```

### Response `200`

```json
{
  "data": {
    "id": 8,
    "hero_image": null,
    "title": "Roder",
    "description": "Tenda Roder berangka besi/alumunium dengan atap PVC tahan cuaca, bebas tiang tengah, mudah dipasang, dan cocok untuk hajatan, bazar, pameran, hingga kebutuhan darurat, tersedia dalam ukuran 5m - 25m sesuai kebutuhan acara.",

    "use_cases": {
      "id": 6,
      "group_name": "Cocok untuk Berbagai Acara",
      "items": [
        {
          "id": 29,
          "name": "Pernikahan & Resepsi",
          "description": "Ruang luas tanpa tiang tengah, leluasa menata kursi dan panggung."
        },
        {
          "id": 30,
          "name": "Bazar & Pameran",
          "description": "Bisa disambung memanjang untuk deretan booth UMKM atau expo."
        }
      ]
    },

    "size_variants": {
      "id": 10,
      "group_name": "Varian Ukuran",
      "items": [
        { "id": 24, "name": "Bentangan 5m",  "image": null },
        { "id": 25, "name": "Bentangan 10m", "image": null },
        { "id": 26, "name": "Bentangan 15m", "image": null },
        { "id": 27, "name": "Bentangan 20m", "image": null },
        { "id": 28, "name": "Bentangan 25m", "image": null }
      ]
    },

    "jenis_roder": {
      "id": 4,
      "group_name": "Jenis-jenis Roder",
      "items": [
        { "id": 4, "name": "Roder Blackout Hitam", "image": null },
        { "id": 5, "name": "Roder Blackout Putih", "image": null },
        { "id": 6, "name": "Roder Transparan",     "image": null }
      ]
    },

    "pilihan_dinding": {
      "id": 20,
      "group_name": "Pilihan Dinding Roder",
      "items": [
        {
          "id": 24,
          "name": "Dinding Polos",
          "description": "Termasuk dalam paket penyewaan",
          "image": null
        },
        {
          "id": 25,
          "name": "Dinding Jendela",
          "description": "Tersedia sebagai opsi tambahan",
          "image": null
        },
        {
          "id": 26,
          "name": "Dinding Transparan",
          "description": "Tersedia sebagai opsi tambahan",
          "image": null
        }
      ]
    },

    "specifications": {
      "id": 10,
      "group_name": "Spesifikasi Umum",
      "items": [
        { "id": 34, "label": "Rangka",        "value": "Alumunium, tahan karat" },
        { "id": 35, "label": "Atap & dinding", "value": "Terpal PVC, waterproof, dengan perlindungan UV" },
        { "id": 36, "label": "Tinggi standar", "value": "4 meter" },
        { "id": 37, "label": "Sistem pasang",  "value": "Knock-down, tanpa tiang tengah" },
        { "id": 38, "label": "Opsional",       "value": "Dinding samping (full cover / transparan), lantai karpet, AC / blower, lighting, panggung" }
      ]
    },

    "yang_anda_dapatkan": {
      "id": 6,
      "group_name": "Yang Anda Dapatkan",
      "items": [
        { "id": 21, "description": "Unit tenda sesuai ukuran pilihan" },
        { "id": 22, "description": "Jasa pemasangan & pembongkaran oleh tim teknisi" },
        { "id": 23, "description": "Pengecekan struktur & keamanan sebelum acara" },
        { "id": 24, "description": "Konsultasi gratis penentuan ukuran & tata letak" }
      ]
    },

    "flooring_modul": {
      "id": 6,
      "group_name": "Flooring Modul",
      "description": "Flooring modul merupakan solusi lantai sementara untuk Tenda Roder dan Tenda Sarnafil. Tersedia dalam beberapa pilihan warna dengan pemasangan yang praktis serta tampilan yang rapi.",
      "items": []
    },

    "pertanyaan_umum": {
      "id": 10,
      "group_name": "Pertanyaan Umum",
      "items": [
        {
          "id": 11,
          "question": "Apakah tenda tahan hujan deras dan angin kencang?",
          "answer": "Dirancang tahan cuaca standar outdoor. Untuk kondisi ekstrem, tim kami menyarankan pengaman tambahan saat survei lokasi."
        },
        {
          "id": 12,
          "question": "Berapa lama proses pemasangan?",
          "answer": "Tergantung ukuran, umumnya 3-8 jam untuk pemasangan lengkap oleh tim teknisi."
        },
        {
          "id": 13,
          "question": "Bisa sewa lebih dari 1 hari?",
          "answer": "Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang."
        },
        {
          "id": 14,
          "question": "Apakah lokasi saya bisa disurvei dulu?",
          "answer": "Sangat disarankan, terutama untuk area luas, tidak rata, atau dengan akses terbatas."
        }
      ]
    }
  }
}
```

> `flooring_modul.items` masih `[]` karena isinya di Figma berupa foto tanpa teks, dan upload gambar belum dilakukan. Render section-nya hanya bila `items.length > 0`, tapi `group_name` dan `description` tetap tampil.

---

# 4. `GET /api/sarnafil`

Struktur sama dengan Roder, **tanpa** `jenis_roder` dan `pilihan_dinding`.

### Contoh request

```bash
curl "http://localhost:1337/api/sarnafil"
```

### Response `200`

```json
{
  "data": {
    "id": 8,
    "hero_image": null,
    "title": "Sarnafil",
    "description": "Atap membran PVC berkualitas tinggi dirancang khusus untuk menghadapi kondisi cuaca outdoor, kedap air, tahan sinar UV, dan tetap kokoh dalam pemakaian jangka panjang untuk berbagai jenis acara.",

    "use_cases": {
      "id": 8,
      "group_name": "Cocok untuk Berbagai Acara",
      "items": [
        {
          "id": 40,
          "name": "Booth Bazar & UMKM",
          "description": "Ukuran ringkas pas untuk satu titik jualan, digandeng berjajar untuk deretan booth."
        },
        {
          "id": 41,
          "name": "Titik Foto & Photo Booth",
          "description": "Puncak kerucut yang khas jadi latar foto di acara ulang tahun atau gathering."
        }
      ]
    },

    "size_variants": {
      "id": 12,
      "group_name": "Varian Ukuran",
      "items": [
        { "id": 31, "name": "Sarnafil 3x3", "image": null },
        { "id": 32, "name": "Sarnafil 5x5", "image": null }
      ]
    },

    "specifications": {
      "id": 12,
      "group_name": "Spesifikasi Umum",
      "items": [
        { "id": 45, "label": "Rangka",         "value": "Alumunium ringan namun kokoh, tahan karat" },
        { "id": 46, "label": "Tiang tengah",   "value": "Tiang penyangga utama sebagai penopang puncak kerucut" },
        { "id": 47, "label": "Atap & dinding", "value": "Membran PVC/sarnafil, waterproof, tahan sinar UV" },
        { "id": 48, "label": "Tinggi puncak",  "value": "3 & 4 meter" },
        { "id": 49, "label": "Bentuk atap",    "value": "Kerucut (cone) khas, dapat dipasang tunggal atau digandeng" },
        { "id": 50, "label": "Opsional",       "value": "Dinding samping full cover, lantai karpet, lighting gantung, dekorasi kain drapery" }
      ]
    },

    "yang_anda_dapatkan": {
      "id": 8,
      "group_name": "Yang Anda Dapatkan",
      "items": [
        { "id": 29, "description": "Unit tenda sesuai ukuran pilihan" },
        { "id": 30, "description": "Jasa pemasangan & pembongkaran oleh tim teknisi" },
        { "id": 31, "description": "Pengecekan struktur & keamanan sebelum acara" },
        { "id": 32, "description": "Konsultasi gratis penentuan ukuran & tata letak" }
      ]
    },

    "flooring_modul": {
      "id": 8,
      "group_name": "Flooring Modul",
      "description": "Flooring modul merupakan solusi lantai sementara untuk Tenda Roder dan Tenda Sarnafil. Tersedia dalam beberapa pilihan warna dengan pemasangan yang praktis serta tampilan yang rapi.",
      "items": []
    },

    "pertanyaan_umum": {
      "id": 12,
      "group_name": "Pertanyaan Umum",
      "items": [
        {
          "id": 18,
          "question": "Apakah tiang tengah mengganggu tata letak acara?",
          "answer": "Tidak terdapat tiang tengah pada tenda sarnafil."
        },
        {
          "id": 19,
          "question": "Berapa lama proses pemasangan?",
          "answer": "Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang."
        },
        {
          "id": 20,
          "question": "Bisa sewa lebih dari 1 hari?",
          "answer": "Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang."
        }
      ]
    }
  }
}
```

---

# 5. `GET /api/peralatan-pendukung`

### Contoh request

```bash
curl "http://localhost:1337/api/peralatan-pendukung"
```

### Response `200`

```json
{
  "data": {
    "id": 8,
    "hero_image": null,
    "title": "Peralatan Pendukung",
    "description": "Kursi, meja, AC, dan misty fan yang kami sediakan siap melengkapi kenyamanan acara, mulai dari tempat duduk, penyajian, hingga sirkulasi udara yang sejuk sepanjang acara berlangsung.",

    "equipment_groups": [
      {
        "id": 22,
        "group_name": "Dekorasi & Ruangan",
        "items": [
          { "id": 50, "name": "Dekorasi",          "image": null },
          { "id": 51, "name": "Flooring / Karpet", "image": null },
          { "id": 52, "name": "Piku Tuoa",         "image": null }
        ]
      },
      {
        "id": 23,
        "group_name": "Kursi & Meja",
        "items": [
          { "id": 53, "name": "Kursi Futura Tanpa Cover", "image": null },
          { "id": 54, "name": "Meja Bulat + Cover",       "image": null }
        ]
      },
      {
        "id": 24,
        "group_name": "Pendingin Ruangan",
        "items": [
          { "id": 55, "name": "Misty Fan", "image": null },
          { "id": 56, "name": "AC @5 Pk",  "image": null }
        ]
      }
    ]
  }
}
```

### ⚠️ Bentuknya beda dari kategori lain

`equipment_groups` adalah **array of section**, bukan satu section. Jadi perlu di-`map` dua tingkat:

```tsx
{data.equipment_groups.map((group) => (
  <section key={group.id}>
    <h2>{group.group_name}</h2>
    {group.items.map((item) => <Card key={item.id} {...item} />)}
  </section>
))}
```

---

# Tipe TypeScript

Tempel ke `types/api.ts` di frontend.

```ts
// --- Media -----------------------------------------------------------------
export type Media = {
  id: number;
  url: string;                      // relatif: "/uploads/nama-file.jpg"
  alternativeText: string | null;   // untuk atribut alt
};

// --- Pembungkus response ---------------------------------------------------
export type ListResponse<T> = {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type SingleResponse<T> = { data: T };

// --- 1. Products -----------------------------------------------------------
export type CategoryKey = 'roder' | 'sarnafil' | 'peralatan-pendukung';

export type Product = {
  id: number;
  title: string;
  description: string | null;
  image: Media | null;
  category_key: CategoryKey;
  display_order: number;
};

// --- 2. Events -------------------------------------------------------------
export type EventCategory =
  | 'korporat' | 'pemerintahan' | 'keagamaan' | 'pendidikan'
  | 'festival' | 'komersial' | 'gathering';

export type EventItem = {
  id: number;
  name: string;
  image: Media | null;
  event_category: EventCategory | null;
  location: string | null;
  duration: string | null;
  is_featured: boolean;
  display_order: number;
};

// --- 3–5. Halaman kategori -------------------------------------------------
export type Section<T> = { id: number; group_name: string; items: T[] };

export type NameDesc      = { id: number; name: string; description: string | null };
export type NameImage     = { id: number; name: string; image: Media | null };
export type NameDescImage = NameDesc & { image: Media | null };
export type TextOnly      = { id: number; description: string };
export type ImageOnly     = { id: number; image: Media | null };
export type Spec          = { id: number; label: string; value: string | null };
export type Faq           = { id: number; question: string; answer: string | null };

export type FlooringSection = Section<ImageOnly> & { description: string | null };

export type RoderPage = {
  id: number;
  title: string;
  description: string | null;
  hero_image: Media | null;
  use_cases: Section<NameDesc>;
  jenis_roder: Section<NameImage>;
  pilihan_dinding: Section<NameDescImage>;
  size_variants: Section<NameImage>;
  yang_anda_dapatkan: Section<TextOnly>;
  flooring_modul: FlooringSection;
  specifications: Section<Spec>;
  pertanyaan_umum: Section<Faq>;
};

export type SarnafilPage = Omit<RoderPage, 'jenis_roder' | 'pilihan_dinding'>;

export type PeralatanPendukungPage = {
  id: number;
  title: string;
  description: string | null;
  hero_image: Media | null;
  equipment_groups: Section<NameImage>[]; // ARRAY, bukan satu section
};
```

### Helper fetch

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1337';

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

const products = await api<Product[]>('/products');
const events   = await api<EventItem[]>('/events?filters[is_featured][$eq]=true');
const roder    = await api<RoderPage>('/roder');
```

---

# Tipe Media

Response gambar sengaja **dipangkas di server** menjadi 3 field saja:

```json
{
  "id": 1,
  "url": "/uploads/foto-tenda_2dd478e8fa.jpg",
  "alternativeText": null
}
```

Bawaan Strapi jauh lebih panjang — ada `formats` (thumbnail/small/medium/large,
masing-masing dengan url, hash, ext, mime, size), plus `hash`, `ext`, `mime`,
`size`, `width`, `height`, `provider`, `documentId`, dan timestamp. Semuanya
tidak dipakai untuk menampilkan gambar, jadi tidak ikut ditarik dari database.

### Dampak ke `next/image`

Karena `width` & `height` tidak dikirim, `next/image` tidak bisa dipakai dengan
cara biasa. Dua pilihan:

```tsx
// 1. Pakai fill — wadahnya wajib position: relative
<div className="relative aspect-video">
  <Image src={`${BASE}${media.url}`} alt={media.alternativeText ?? ''} fill />
</div>

// 2. Atau tetapkan dimensi sendiri di frontend
<Image src={`${BASE}${media.url}`} alt={media.alternativeText ?? ''} width={800} height={600} />
```

**`url` bersifat relatif**, jadi harus digabung dengan base URL. Sebagian besar
gambar masih `null` karena belum diunggah — selalu siapkan fallback:

```ts
const src = media ? `${BASE}${media.url}` : '/placeholder.jpg';
```

> Kalau nanti butuh versi kecil (thumbnail) untuk kartu, `formats` bisa
> dikembalikan dengan menambah `'formats'` ke `MEDIA_FIELDS` di
> `src/utils/media.ts` — satu baris, berlaku untuk semua endpoint.

---

# Penanganan error

Data tidak ditemukan → **404**:

```json
{
  "data": null,
  "error": { "status": 404, "name": "NotFoundError", "message": "Not Found", "details": {} }
}
```

Untuk single type yang belum diisi admin, `data` bisa bernilai `null`. Selalu cek `res.ok` dan pastikan komponen aman terhadap `data === null`.

---

# Catatan lain

**Urutan key.** Susunan key pada response mengikuti layout di Content Manager → *Configure the view*, dan menyesuaikan maksimal 30 detik setelah admin menyusun ulang (ada cache). Ini murni kosmetik — **jangan dipakai untuk logika**, akses tetap lewat nama field. Field mana saja yang keluar tetap ditentukan backend: menambah field di layout admin tidak otomatis memunculkannya di API.

**`id` bersifat sementara, bukan identitas permanen.** Nilai `id` pada section dan item di dalamnya **dibuat ulang setiap kali admin menyimpan konten**. Aman dipakai sebagai `key` React saat render (unik dalam satu response), tapi **jangan disimpan, di-bookmark, atau dijadikan acuan di URL**. Angka `id` pada contoh JSON di atas hanya ilustrasi — nilainya akan berbeda di server kamu.

Untuk mengenali kategori secara permanen, pakai `category_key` pada `/api/products`.

**Pagination.** `pageSize` default 25, maksimum 100 (diatur di `config/api.ts`). Endpoint kategori tidak punya pagination.
