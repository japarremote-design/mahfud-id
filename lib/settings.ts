import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";

// SATU sumber kebenaran untuk semua yang dulunya hardcode per-tokoh.
// Diisi lewat panel /admin/pengaturan — bukan diedit di kode. Supaya
// template ini bisa dipakai ulang untuk tokoh lain tanpa ganti satu
// baris pun, cukup ganti isian di panel (dan project Firebase kalau
// mau data terpisah).
export interface SiteSettings {
  namaTokoh: string;
  gelarSingkat: string;      // "S.Pd.I., M.E.I." — ditampilkan nempel nama
  jabatanBadge: string;      // teks badge kecil di hero, ex: "ANGGOTA DPRD KABUPATEN SAMPANG"
  kutipanHero: string;       // kutipan 1 kalimat, jadi headline besar di hero (bukan nama)
  deskripsiSingkat: string;  // bio 2-3 kalimat
  banner: string;            // URL foto banner hero
  logoPart1: string;         // ex: "MAH" (kotak warna)
  logoPart2: string;         // ex: "FUD" (teks putih)
  warnaBrand: string;        // hex, ex: #FE5000
  whatsapp: string;          // format 62xxxxxxxxxx (tanpa +)
  email: string;
  alamat: string;
  facebook: string;
  instagram: string;
  telegram: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  footerKeterangan: string;  // ex: "Anggota DPRD Kabupaten Sampang, Komisi IV (Fraksi PKS)"
  tahunMulaiCopyright: string; // ex: "2026"
  poweredByNama: string;     // ex: "qfazdigital.my.id"
  poweredByUrl: string;      // ex: "https://www.qfazdigital.my.id/"
  siteUrl: string;           // ex: "https://mahfud.id"
}

export const DEFAULT_SETTINGS: SiteSettings = {
  namaTokoh: "Nama Tokoh",
  gelarSingkat: "",
  jabatanBadge: "JABATAN / GELAR",
  kutipanHero: "",
  deskripsiSingkat: "Tuliskan bio singkat tokoh di panel Pengaturan Situs.",
  banner: "",
  logoPart1: "LOG",
  logoPart2: "O",
  warnaBrand: "#FE5000",
  whatsapp: "",
  email: "",
  alamat: "",
  facebook: "",
  instagram: "",
  telegram: "",
  twitter: "",
  tiktok: "",
  youtube: "",
  footerKeterangan: "",
  tahunMulaiCopyright: String(new Date().getFullYear()),
  poweredByNama: "qfazdigital.my.id",
  poweredByUrl: "https://www.qfazdigital.my.id/",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
};

// Dipakai di server components (generateMetadata, manifest) DAN
// bisa juga dipanggil sekali dari client — tidak pakai listener realtime.
export async function getSettings(): Promise<SiteSettings> {
  try {
    const snap = await get(ref(db, "pengaturan/umum"));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...snap.val() };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const SETTINGS_FORM_GROUPS: { title: string; fields: { key: keyof SiteSettings; label: string; type?: "text" | "textarea" | "color" | "image"; placeholder?: string }[] }[] = [
  {
    title: "Identitas Tokoh",
    fields: [
      { key: "namaTokoh", label: "Nama Lengkap" },
      { key: "gelarSingkat", label: "Gelar (nempel di belakang nama)", placeholder: "S.Pd.I., M.E.I." },
      { key: "jabatanBadge", label: "Badge Jabatan (di hero)", placeholder: "ANGGOTA DPRD KABUPATEN SAMPANG" },
      { key: "kutipanHero", label: "Kutipan Headline Hero (opsional, 1 kalimat — lebih berkesan daripada nama besar)", type: "textarea", placeholder: "\"Melayani rakyat adalah amanah, bukan sekadar jabatan.\"" },
      { key: "deskripsiSingkat", label: "Deskripsi / Bio Singkat", type: "textarea" },
      { key: "banner", label: "Foto Banner (URL gambar)", type: "image" },
    ],
  },
  {
    title: "Logo & Tampilan",
    fields: [
      { key: "logoPart1", label: "Logo bagian 1 (kotak warna)", placeholder: "MAH" },
      { key: "logoPart2", label: "Logo bagian 2 (teks putih)", placeholder: "FUD" },
      { key: "warnaBrand", label: "Warna Utama Situs", type: "color" },
    ],
  },
  {
    title: "Kontak",
    fields: [
      { key: "whatsapp", label: "Nomor WhatsApp (format 62xxx)", placeholder: "62812xxxxxxx" },
      { key: "email", label: "Email" },
      { key: "alamat", label: "Alamat / Kantor", type: "textarea" },
    ],
  },
  {
    title: "Media Sosial (kosongkan jika tidak ada)",
    fields: [
      { key: "facebook", label: "URL Facebook" },
      { key: "instagram", label: "URL Instagram" },
      { key: "telegram", label: "URL Telegram" },
      { key: "twitter", label: "URL X / Twitter" },
      { key: "tiktok", label: "URL TikTok" },
      { key: "youtube", label: "URL YouTube" },
    ],
  },
  {
    title: "Footer & Situs",
    fields: [
      { key: "footerKeterangan", label: "Keterangan singkat di footer", placeholder: "Anggota DPRD ... Fraksi ..." },
      { key: "tahunMulaiCopyright", label: "Tahun mulai hak cipta" },
      { key: "poweredByNama", label: "Nama \"Powered by\"" },
      { key: "poweredByUrl", label: "URL \"Powered by\"" },
      { key: "siteUrl", label: "URL situs (untuk OG & canonical)", placeholder: "https://domain-tokoh.id" },
    ],
  },
];
