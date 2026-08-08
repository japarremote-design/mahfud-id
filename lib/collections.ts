// Definisi semua koleksi yang bisa di-CRUD dari /admin.
// Nambah koleksi baru = nambah satu entri di sini, form admin otomatis muncul.
export type FieldType = "text" | "textarea" | "richtext" | "image" | "date" | "url" | "select" | "boolean" | "file";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // untuk type "select"
  placeholder?: string;
}

export interface CollectionDef {
  slug: string;       // path di Realtime DB & di URL admin /admin/[slug]
  label: string;
  icon: string;        // nama ikon Font Awesome
  fields: FieldDef[];
  listTitleKey: string; // field yang dipakai sebagai judul di daftar admin
  publicPath?: string;  // path publik untuk link "lihat halaman"
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: "artikel",
    label: "Gagasan & Berita",
    icon: "fa-lightbulb",
    listTitleKey: "judul",
    publicPath: "/gagasan",
    fields: [
      { key: "judul", label: "Judul", type: "text", required: true },
      { key: "slug", label: "Slug URL (huruf kecil, pakai -)", type: "text", required: true, placeholder: "contoh: mengawal-hak-guru-ngaji" },
      { key: "ringkasan", label: "Ringkasan singkat", type: "textarea", required: true },
      { key: "isi", label: "Isi lengkap", type: "richtext", required: true },
      { key: "cover", label: "Gambar cover (URL)", type: "image" },
      { key: "isExternal", label: "Tautan luar? (isi sourceUrl jika ya)", type: "boolean" },
      { key: "sourceUrl", label: "URL sumber luar (jika tautan luar)", type: "url" },
      { key: "sourceName", label: "Nama media sumber", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["draft", "terbit"], required: true },
    ],
  },
  {
    slug: "galeri",
    label: "Pengabdian / Galeri",
    icon: "fa-images",
    listTitleKey: "judul",
    publicPath: "/pengabdian",
    fields: [
      { key: "judul", label: "Judul kegiatan", type: "text", required: true },
      { key: "narasi", label: "Cerita / narasi kegiatan", type: "textarea", required: true },
      { key: "gambar1", label: "Gambar 1 (URL)", type: "image", required: true },
      { key: "gambar2", label: "Gambar 2 (URL)", type: "image" },
      { key: "gambar3", label: "Gambar 3 (URL)", type: "image" },
      { key: "gambar4", label: "Gambar 4 (URL)", type: "image" },
      { key: "lokasi", label: "Lokasi", type: "text" },
      { key: "tanggal", label: "Tanggal", type: "date" },
    ],
  },
  {
    slug: "event",
    label: "Event / Agenda",
    icon: "fa-calendar-days",
    listTitleKey: "judul",
    publicPath: "/event",
    fields: [
      { key: "judul", label: "Judul event", type: "text", required: true },
      { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true },
      { key: "tanggal", label: "Tanggal", type: "date", required: true },
      { key: "lokasi", label: "Lokasi", type: "text", required: true },
      { key: "poster", label: "Poster (URL)", type: "image" },
      { key: "status", label: "Status", type: "select", options: ["akan datang", "selesai"], required: true },
    ],
  },
  {
    slug: "peran",
    label: "Section Profil (dinamis)",
    icon: "fa-user",
    listTitleKey: "judul",
    publicPath: "/profil",
    fields: [
      { key: "urutan", label: "Urutan tampil (angka)", type: "text", required: true },
      { key: "eyebrow", label: "Label kecil di atas judul", type: "text" },
      { key: "judul", label: "Judul section", type: "text", required: true },
      { key: "isi", label: "Isi / paragraf", type: "textarea", required: true },
      { key: "gambar", label: "Gambar (URL)", type: "image" },
      { key: "anchorId", label: "ID anchor (unik, huruf kecil)", type: "text", required: true },
    ],
  },
  {
    slug: "statistik",
    label: "Statistik / Angka Pencapaian",
    icon: "fa-chart-simple",
    listTitleKey: "label",
    fields: [
      { key: "icon", label: "Ikon Font Awesome (ex: fa-square-poll-vertical)", type: "text", required: true, placeholder: "fa-square-poll-vertical" },
      { key: "angka", label: "Angka / Nilai", type: "text", required: true, placeholder: "5.423" },
      { key: "label", label: "Label", type: "text", required: true, placeholder: "Suara Pemilu 2024" },
      { key: "urutan", label: "Urutan tampil (angka)", type: "text", required: true },
    ],
  },
  {
    slug: "riwayat",
    label: "Riwayat / Timeline Jabatan",
    icon: "fa-star-of-life",
    listTitleKey: "judul",
    fields: [
      { key: "periode", label: "Periode", type: "text", required: true, placeholder: "2025 - 2030" },
      { key: "judul", label: "Nama Jabatan", type: "text", required: true },
      { key: "deskripsi", label: "Deskripsi singkat", type: "textarea", required: true },
      { key: "urutan", label: "Urutan tampil (angka, terbaru = 1)", type: "text", required: true },
    ],
  },
  {
    slug: "aspirasi",
    label: "Aspirasi Masuk",
    icon: "fa-file-pen",
    listTitleKey: "nama",
    fields: [
      { key: "nama", label: "Nama", type: "text", required: true },
      { key: "alamat", label: "Alamat", type: "text", required: true },
      { key: "desa", label: "Desa", type: "text" },
      { key: "kecamatan", label: "Kecamatan", type: "text" },
      { key: "whatsapp", label: "No HP/WA", type: "text", required: true },
      { key: "aspirasi", label: "Isi aspirasi", type: "textarea", required: true },
      { key: "opdTarget", label: "OPD tujuan", type: "text" },
      { key: "ktpPath", label: "Lampiran KTP", type: "file" },
      { key: "status", label: "Status tindak lanjut", type: "select", options: ["baru", "diproses", "selesai"], required: true },
    ],
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
