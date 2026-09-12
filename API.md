# API Reference — Adi Indotent

Panduan untuk tim frontend. Semua contoh di dokumen ini diambil dari respons
asli server, bukan perkiraan.

## Bentuk CMS-nya

CMS-nya **Payload 3 yang berjalan di dalam app Next.js ini**, bukan server
terpisah. Konsekuensinya:

- Tidak ada base URL dan tidak ada CORS yang perlu diatur.
- Cara utama mengambil data bukan `fetch`, melainkan **Local API** — panggilan
  langsung ke database tanpa melewati HTTP.

---

## Cara membaca data

### Local API — pakai ini

Hanya bisa dipanggil di sisi server: Server Component, Route Handler, atau
Server Action. Tidak ada network call, jadi tidak ada latensi HTTP dan tidak
ada endpoint yang perlu dijaga.

```tsx
// src/app/(frontend)/page.tsx
import config from '@payload-config';
import { getPayload } from 'payload';

export const revalidate = 300; // halaman di-cache 5 menit

export default async function Home() {
  const payload = await getPayload({ config });

  const { docs: products } = await payload.find({
    collection: 'products',
    sort: 'display_order',
  });

  const roder = await payload.findGlobal({ slug: 'roder' });

  return <pre>{JSON.stringify({ products, roder }, null, 2)}</pre>;
}
```

`getPayload` aman dipanggil berkali-kali — instance-nya di-cache di dalam proses.

### REST — untuk mengecek isi data

Bukan untuk dipakai frontend, tapi berguna saat ingin melihat isi data lewat
browser. Dev server harus jalan.

```
http://localhost:3000/api/products
http://localhost:3000/api/events
http://localhost:3000/api/globals/roder
http://localhost:3000/api/globals/sarnafil
http://localhost:3000/api/globals/peralatan-pendukung
```

---

## Daftar sumber data

| Sumber | Jenis | Dipakai untuk |
| --- | --- | --- |
| `products` | collection, 3 dokumen | Products Overview (home) + submenu navbar |
| `events` | collection, 11 dokumen | Section Events (home) + halaman Events |
| `roder` | global | Halaman detail kategori Roder |
| `sarnafil` | global | Halaman detail kategori Sarnafil |
| `peralatan-pendukung` | global | Halaman detail kategori Peralatan Pendukung |

Section statis (Landing, Company Background, Why Us, Contact & Address) tidak
punya data CMS — kontennya di-hardcode di frontend.

---

## Aturan yang berlaku di semua endpoint

### Bentuk gambar

Setiap gambar selalu keluar sebagai objek tiga field, atau `null` kalau belum
diisi:

```json
{
  "id": 1,
  "url": "/api/media/file/1420fdb2c1b84a55bc9a61e3050b0fa5.jpg",
  "alt": "cat study img"
}
```

`url` berupa path relatif, jadi bisa langsung dipakai `next/image`:

```tsx
{product.hero_image && (
  <Image
    src={product.hero_image.url}
    alt={product.hero_image.alt ?? ''}
    width={800}
    height={600}
  />
)}
```

### Status draft

Setiap dokumen punya `_status` bernilai `"published"` atau `"draft"`. Supaya
konten yang belum siap tidak bocor ke situs, filter eksplisit:

```ts
await payload.find({
  collection: 'events',
  where: { _status: { equals: 'published' } },
  sort: 'display_order',
});
```

### Urutan dan paginasi

`products` dan `events` sudah diurutkan `display_order` secara default. Batas
bawaan 10 dokumen per halaman — **`events` ada 11**, jadi kalau ingin semuanya
sekaligus, naikkan `limit`:

```ts
await payload.find({ collection: 'events', limit: 100 });
```

---

## 1. `products`

Kartu kategori di home. `category_key` menentukan halaman detail mana yang
dibuka, sekaligus global mana yang dipakai.

```ts
const { docs } = await payload.find({ collection: 'products', sort: 'display_order' });
```

Satu dokumen:

```json
{
  "id": 1,
  "title": "Roder",
  "description": "Tenda Roder tersedia dalam berbagai ukuran, mulai dari 10m hingga 25m.",
  "category_key": "roder",
  "display_order": 1,
  "hero_image": {
    "id": 1,
    "url": "/api/media/file/1420fdb2c1b84a55bc9a61e3050b0fa5.jpg",
    "alt": "cat study img"
  },
  "_status": "published",
  "createdAt": "2026-08-22T13:04:37.433Z",
  "updatedAt": "2026-08-22T13:04:37.434Z"
}
```

| Field | Tipe | Catatan |
| --- | --- | --- |
| `title` | string | |
| `description` | string \| null | Teks pendek untuk kartu — **berbeda** dari `description` di global, yang merupakan paragraf pembuka halaman |
| `category_key` | `"roder"` \| `"sarnafil"` \| `"peralatan-pendukung"` | Unik. Pakai ini untuk membangun URL halaman detail |
| `display_order` | number | |
| `hero_image` | objek gambar \| null | **Tidak disimpan di collection ini.** Diambil otomatis dari `hero_image` milik global yang `category_key`-nya cocok, supaya gambar cukup diatur di satu tempat |

Response pembungkusnya:

```json
{
  "docs": [],
  "totalDocs": 3,
  "limit": 10,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPrevPage": false,
  "nextPage": null,
  "prevPage": null,
  "pagingCounter": 1
}
```

---

## 2. `events`

```ts
const { docs } = await payload.find({
  collection: 'events',
  limit: 100,
  sort: 'display_order',
});
```

```json
{
  "id": 1,
  "name": "Aeon Mall Cikarang",
  "image": null,
  "event_category": "bazaar",
  "location": "Cikarang",
  "duration": "3 hari",
  "is_featured": true,
  "display_order": 1,
  "_status": "published",
  "createdAt": "2026-08-22T13:04:38.239Z",
  "updatedAt": "2026-08-22T13:04:38.239Z"
}
```

| Field | Tipe | Catatan |
| --- | --- | --- |
| `name` | string | |
| `image` | objek gambar \| null | Semua event masih `null`, gambarnya diunggah lewat admin |
| `event_category` | enum \| null | `korporat`, `pemerintahan`, `keagamaan`, `festival`, `bazaar`, `wedding`, `komunitas` |
| `location` | string \| null | |
| `duration` | string \| null | Teks bebas, mis. `"3 hari"` |
| `is_featured` | boolean | 3 event pertama bernilai `true` |
| `display_order` | number | |

Mengambil yang unggulan saja:

```ts
await payload.find({
  collection: 'events',
  where: { is_featured: { equals: true } },
});
```

---

## 3. Global kategori: `roder`, `sarnafil`, `peralatan-pendukung`

```ts
const roder = await payload.findGlobal({ slug: 'roder' });
```

Ketiganya punya kepala yang sama:

| Field | Tipe |
| --- | --- |
| `title` | string |
| `description` | string \| null |
| `hero_image` | objek gambar \| null |

Isi badannya berbeda per kategori:

| Section | Roder | Sarnafil | Peralatan Pendukung |
| --- | :---: | :---: | :---: |
| `use_cases` | ada | ada | — |
| `jenis_roder` | ada | — | — |
| `pilihan_dinding` | ada | — | — |
| `size_variants` | ada | ada | — |
| `yang_anda_dapatkan` | ada | ada | — |
| `flooring_modul` | ada | ada | — |
| `specifications` | ada | ada | — |
| `pertanyaan_umum` | ada | ada | — |
| `equipment_groups` | — | — | ada |

### Bentuk section

Semua section pada Roder dan Sarnafil memakai pola sama: satu objek berisi
`group_name` (judul yang tampil) dan `items` (daftar isinya).

```json
"use_cases": {
  "group_name": "Cocok untuk Berbagai Acara",
  "items": [
    {
      "id": "6a899e6944e57c8cf078a92a",
      "name": "Pernikahan & Resepsi",
      "description": "Ruang luas tanpa tiang tengah, leluasa menata kursi dan panggung."
    }
  ]
}
```

`id` tiap item berupa string acak — pakai sebagai `key` saat me-render list.

Isi `items` berbeda per section:

| Section | Field tiap item |
| --- | --- |
| `use_cases` | `name`, `description` |
| `jenis_roder` | `name`, `image` |
| `pilihan_dinding` | `name`, `description`, `image` |
| `size_variants` | `name`, `image` |
| `yang_anda_dapatkan` | `description` |
| `flooring_modul` | `image` |
| `specifications` | `label`, `value` |
| `pertanyaan_umum` | `question`, `answer` |

Satu pengecualian: **`flooring_modul` punya `description` di level section**, di
samping `group_name`.

```json
"flooring_modul": {
  "group_name": "Flooring Modul",
  "description": "Flooring modul merupakan solusi lantai sementara untuk Tenda Roder dan Tenda Sarnafil...",
  "items": []
}
```

`items`-nya sengaja kosong — galerinya belum ada di Figma. Frontend harus tahan
menghadapi `items: []` di section mana pun.

### `peralatan-pendukung` bersarang dua tingkat

```json
{
  "title": "Peralatan Pendukung",
  "description": "Kursi, meja, AC, dan misty fan ...",
  "hero_image": null,
  "equipment_groups": [
    {
      "id": "6a899e6b44e57c8cf078a95f",
      "group_name": "Dekorasi & Ruangan",
      "items": [
        { "id": "6a899e6b44e57c8cf078a95c", "name": "Dekorasi", "image": null }
      ]
    }
  ]
}
```

Tiga grup terisi: `Dekorasi & Ruangan`, `Kursi & Meja`, `Pendingin Ruangan`.

---

## Tipe TypeScript

Jangan menulis tipe sendiri. Payload menghasilkannya dari skema:

```ts
import type {
  Event,
  Media,
  PeralatanPendukung,
  Product,
  Roder,
  Sarnafil,
} from '@/payload-types';
```

File itu dibuat ulang dengan `npm run generate:types` setiap kali skema berubah.
Jangan diedit manual.

Satu hal yang perlu diketahui: pada tipe hasil generate, relasi gambar bertipe
`number | Media`. Saat dibaca lewat Local API dengan `depth` bawaan isinya
selalu objek, tapi TypeScript tetap menuntut penyempitan tipe:

```ts
const image = typeof product.hero_image === 'object' ? product.hero_image : null;
```

---

## Perintah yang berguna

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan situs + admin panel di `localhost:3000` |
| `npm run check` | Menghitung isi tiap collection & global lewat Local API |
| `npm run seed` | Mengisi konten awal. Menolak jalan kalau database sudah berisi konten |
| `npm run seed:force` | Memaksa seed di atas database yang sudah berisi. Tetap tidak menimpa data yang ada |
| `npm run generate:types` | Membuat ulang `src/payload-types.ts` |

Admin panel ada di `http://localhost:3000/admin`.
