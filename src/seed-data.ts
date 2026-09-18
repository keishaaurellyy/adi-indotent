export const products = [
  {
    title: 'Roder',
    category_key: 'roder',
    description: 'Tenda Roder tersedia dalam berbagai ukuran, mulai dari 10m hingga 25m.',
    display_order: 1,
  },
  {
    title: 'Sarnafil',
    category_key: 'sarnafil',
    description:
      'Atap membran PVC berkualitas tinggi dirancang khusus untuk menghadapi kondisi cuaca outdoor, kedap air, tahan sinar UV, dan tetap kokoh dalam pemakaian jangka panjang untuk berbagai jenis acara.',
    display_order: 2,
  },
  {
    title: 'Peralatan Pendukung',
    category_key: 'peralatan-pendukung',
    description:
      'Kursi, meja, AC, dan misty fan yang kami sediakan siap melengkapi kenyamanan acara, mulai dari tempat duduk, penyajian, hingga sirkulasi udara yang sejuk sepanjang acara berlangsung.',
    display_order: 3,
  },
];

const FLOORING_DESCRIPTION =
  'Flooring modul merupakan solusi lantai sementara untuk Tenda Roder dan Tenda Sarnafil. Tersedia dalam beberapa pilihan warna dengan pemasangan yang praktis serta tampilan yang rapi.';

const YANG_ANDA_DAPATKAN_ITEMS = [
  { description: 'Unit tenda sesuai ukuran pilihan' },
  { description: 'Jasa pemasangan & pembongkaran oleh tim teknisi' },
  { description: 'Pengecekan struktur & keamanan sebelum acara' },
  { description: 'Konsultasi gratis penentuan ukuran & tata letak' },
];

export const roder = {
  title: 'Roder',
  description:
    'Tenda Roder berangka besi/alumunium dengan atap PVC tahan cuaca, bebas tiang tengah, mudah dipasang, dan cocok untuk hajatan, bazar, pameran, hingga kebutuhan darurat, tersedia dalam ukuran 5m - 25m sesuai kebutuhan acara.',
  use_cases: {
    group_name: 'Cocok untuk Berbagai Acara',
    items: [
      {
        name: 'Pernikahan & Resepsi',
        description: 'Ruang luas tanpa tiang tengah, leluasa menata kursi dan panggung.',
      },
      {
        name: 'Bazar & Pameran',
        description: 'Bisa disambung memanjang untuk deretan booth UMKM atau expo.',
      },
      {
        name: 'Corporate Event',
        description: 'Tampilan rapi dan profesional, cocok untuk launching produk.',
      },
      {
        name: 'Posko Sosial & Kesehatan',
        description: 'Pemasangan cepat untuk kebutuhan darurat atau kegiatan komunitas.',
      },
      {
        name: 'Gudang Sementara',
        description: 'Terpal tahan cuaca, aman melindungi barang dari hujan dan panas.',
      },
      {
        name: 'Sewa Serbaguna',
        description: 'Fleksibel untuk kebutuhan harian, mingguan, hingga bulanan.',
      },
    ],
  },
  jenis_roder: {
    group_name: 'Jenis-jenis Roder',
    items: [
      { name: 'Roder Blackout Hitam' },
      { name: 'Roder Blackout Putih' },
      { name: 'Roder Transparan' },
    ],
  },
  pilihan_dinding: {
    group_name: 'Pilihan Dinding Roder',
    items: [
      { name: 'Dinding Polos', description: 'Termasuk dalam paket penyewaan' },
      { name: 'Dinding Jendela', description: 'Tersedia sebagai opsi tambahan' },
      { name: 'Dinding Transparan', description: 'Tersedia sebagai opsi tambahan' },
    ],
  },
  size_variants: {
    group_name: 'Varian Ukuran',
    items: [
      { name: 'Bentangan 5m' },
      { name: 'Bentangan 10m' },
      { name: 'Bentangan 15m' },
      { name: 'Bentangan 20m' },
      { name: 'Bentangan 25m' },
    ],
  },
  yang_anda_dapatkan: {
    group_name: 'Yang Anda Dapatkan',
    items: YANG_ANDA_DAPATKAN_ITEMS,
  },
  flooring_modul: {
    group_name: 'Flooring Modul',
    description: FLOORING_DESCRIPTION,
    items: [],
  },
  specifications: {
    group_name: 'Spesifikasi Umum',
    items: [
      { label: 'Rangka', value: 'Alumunium, tahan karat' },
      { label: 'Atap & dinding', value: 'Terpal PVC, waterproof, dengan perlindungan UV' },
      { label: 'Tinggi standar', value: '4 meter' },
      { label: 'Sistem pasang', value: 'Knock-down, tanpa tiang tengah' },
      {
        label: 'Opsional',
        value:
          'Dinding samping (full cover / transparan), lantai karpet, AC / blower, lighting, panggung',
      },
    ],
  },
  pertanyaan_umum: {
    group_name: 'Pertanyaan Umum',
    items: [
      {
        question: 'Apakah tenda tahan hujan deras dan angin kencang?',
        answer:
          'Dirancang tahan cuaca standar outdoor. Untuk kondisi ekstrem, tim kami menyarankan pengaman tambahan saat survei lokasi.',
      },
      {
        question: 'Berapa lama proses pemasangan?',
        answer: 'Tergantung ukuran, umumnya 3-8 jam untuk pemasangan lengkap oleh tim teknisi.',
      },
      {
        question: 'Bisa sewa lebih dari 1 hari?',
        answer:
          'Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang.',
      },
      {
        question: 'Apakah lokasi saya bisa disurvei dulu?',
        answer: 'Sangat disarankan, terutama untuk area luas, tidak rata, atau dengan akses terbatas.',
      },
    ],
  },
};

export const sarnafil = {
  title: 'Sarnafil',
  description:
    'Atap membran PVC berkualitas tinggi dirancang khusus untuk menghadapi kondisi cuaca outdoor, kedap air, tahan sinar UV, dan tetap kokoh dalam pemakaian jangka panjang untuk berbagai jenis acara.',
  use_cases: {
    group_name: 'Cocok untuk Berbagai Acara',
    items: [
      {
        name: 'Booth Bazar & UMKM',
        description:
          'Ukuran ringkas pas untuk satu titik jualan, digandeng berjajar untuk deretan booth.',
      },
      {
        name: 'Titik Foto & Photo Booth',
        description: 'Puncak kerucut yang khas jadi latar foto di acara ulang tahun atau gathering.',
      },
      {
        name: 'Sudut Sajian',
        description: 'Melindungi meja makanan atau minuman dari terik dan hujan pada acara outdoor.',
      },
      {
        name: 'Pos Penerima Tamu',
        description: 'Cocok sebagai meja tamu atau area penyambutan di pintu masuk acara.',
      },
      {
        name: 'Warung & Kios Kaki Lima',
        description: 'Praktis untuk pedagang kaki lima, warung sementara, atau lapak jualan harian.',
      },
    ],
  },
  size_variants: {
    group_name: 'Varian Ukuran',
    items: [{ name: 'Sarnafil 3x3' }, { name: 'Sarnafil 5x5' }],
  },
  yang_anda_dapatkan: {
    group_name: 'Yang Anda Dapatkan',
    items: YANG_ANDA_DAPATKAN_ITEMS,
  },
  flooring_modul: {
    group_name: 'Flooring Modul',
    description: FLOORING_DESCRIPTION,
    items: [],
  },
  specifications: {
    group_name: 'Spesifikasi Umum',
    items: [
      { label: 'Rangka', value: 'Alumunium ringan namun kokoh, tahan karat' },
      { label: 'Tiang tengah', value: 'Tiang penyangga utama sebagai penopang puncak kerucut' },
      { label: 'Atap & dinding', value: 'Membran PVC/sarnafil, waterproof, tahan sinar UV' },
      { label: 'Tinggi puncak', value: '3 & 4 meter' },
      { label: 'Bentuk atap', value: 'Kerucut (cone) khas, dapat dipasang tunggal atau digandeng' },
      {
        label: 'Opsional',
        value: 'Dinding samping full cover, lantai karpet, lighting gantung, dekorasi kain drapery',
      },
    ],
  },
  pertanyaan_umum: {
    group_name: 'Pertanyaan Umum',
    items: [
      {
        question: 'Apakah tiang tengah mengganggu tata letak acara?',
        answer: 'Tidak terdapat tiang tengah pada tenda sarnafil.',
      },
      {
        question: 'Berapa lama proses pemasangan?',
        answer:
          'Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang.',
      },
      {
        question: 'Bisa sewa lebih dari 1 hari?',
        answer:
          'Bisa. Tersedia paket harian, mingguan, hingga bulanan. Hubungi kami untuk harga khusus durasi panjang.',
      },
    ],
  },
};

export const peralatanPendukung = {
  title: 'Peralatan Pendukung',
  description:
    'Kursi, meja, AC, dan misty fan yang kami sediakan siap melengkapi kenyamanan acara, mulai dari tempat duduk, penyajian, hingga sirkulasi udara yang sejuk sepanjang acara berlangsung.',
  equipment_groups: [
    {
      group_name: 'Dekorasi & Ruangan',
      items: [{ name: 'Dekorasi' }, { name: 'Flooring / Karpet' }, { name: 'Piku Tuoa' }],
    },
    {
      group_name: 'Kursi & Meja',
      items: [{ name: 'Kursi Futura Tanpa Cover' }, { name: 'Meja Bulat + Cover' }],
    },
    {
      group_name: 'Pendingin Ruangan',
      items: [{ name: 'Misty Fan' }, { name: 'AC @5 Pk' }],
    },
  ],
};

export const events = [
  { name: 'Aeon Mall Cikarang', location: 'Cikarang', event_category: 'bazaar' },
  { name: 'Alun-alun Cilegon', location: 'Cilegon', event_category: 'pemerintahan' },
  { name: 'Apel Ojek Online Kamtibmas', location: 'Lampung', event_category: 'pemerintahan' },
  { name: 'Bakti Indonesia Masjid Istiqlal', location: 'Jakarta', event_category: 'keagamaan' },
  { name: 'Buka Puasa Bersama TNI & Polri', location: 'Cilegon', event_category: 'keagamaan' },
  { name: 'Bukber & Sholat Tarawih', location: 'Jakarta', event_category: 'keagamaan' },
  { name: 'Kelas Bimbel Tatap Muka', location: 'Bogor', event_category: 'komunitas' },
  { name: 'Lampung Fest', location: 'Lampung', event_category: 'festival' },
  { name: 'Lembah Hijau Cianjur', location: 'Cianjur', event_category: 'komunitas' },
  { name: 'MTQ', location: 'Bogor', event_category: 'keagamaan' },
  { name: 'Pabrik Cikarang', location: 'Cikarang', event_category: 'korporat' },
].map((event, index) => ({
  ...event,
  duration: '3 hari',
  is_featured: index < 3,
  display_order: index + 1,
}));
