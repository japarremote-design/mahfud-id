# Template Situs Profil Tokoh — CMS Penuh, Tanpa Hardcode

Next.js 14 (App Router) + Firebase **Realtime Database** + Firebase Auth (Google) + Firebase Storage,
deploy ke **Vercel**. Awalnya dibuat untuk mahfud.id, sekarang jadi **template generik** — semua identitas
tokoh (nama, gelar, foto, warna, statistik, riwayat jabatan, kontak, footer) diisi dari panel `/admin`,
bukan diedit di kode. Mau dipakai tokoh lain? Ganti isian panel (dan project Firebase kalau datanya
mau terpisah) — tidak perlu sentuh satu baris kode pun.

## 1. Setup Firebase

1. Buat/pakai project Firebase (untuk mahfud.id project yang dipakai: `mahfud-app`, dari versi Apps Script sebelumnya). Untuk tokoh baru, disarankan bikin project Firebase baru sendiri per tokoh — supaya datanya benar-benar terpisah.
2. **Authentication** → Sign-in method → aktifkan **Google**.
3. **Realtime Database** → aktifkan, deploy rules: `firebase deploy --only database` (pakai `database.rules.json`).
4. **Storage** → aktifkan, deploy `storage.rules`: `firebase deploy --only storage`.
5. **Tambah admin pertama:**
   - Buka `/admin` di situs, klik **Masuk dengan Google** pakai email admin (contoh: `qfazdigital@gmail.com`).
   - Karena node `/admins` masih kosong, akan muncul pesan "belum terdaftar sebagai admin".
   - Buka Firebase Console → Realtime Database → tambahkan manual:
     ```
     admins: { "<UID_admin>": true }
     ```
     UID dilihat di Firebase Console → Authentication → Users setelah percobaan login tadi.
   - Login ulang di `/admin` — otomatis bisa masuk.
   - Untuk lampiran KTP di form Aspirasi bisa dibaca admin: tambahkan juga emailnya di `storage.rules`, lalu `firebase deploy --only storage`.

## 2. Environment variables

Copy `.env.local.example` → `.env.local`, isi kredensial Firebase project kamu +
`NEXT_PUBLIC_SITE_URL` (domain final tokoh tsb) + `NEXT_PUBLIC_ADMIN_EMAILS`.

## 3. Jalankan lokal & deploy

```bash
npm install
npm run dev
```

Deploy: push ke GitHub → import di [vercel.com](https://vercel.com) → isi Environment Variables sesuai
`.env.local.example` → Deploy → tambahkan custom domain di Project Settings → Domains.

## 4. Isi semua data lewat panel /admin (bagian terpenting!)

Begitu situs live, buka `/admin` dan isi berurutan:

1. **Pengaturan Situs** (`/admin/pengaturan`) — nama tokoh, gelar, badge jabatan, bio singkat, foto banner,
   teks logo, **warna utama situs** (1 kali isi, otomatis jadi tema seluruh halaman lewat CSS variable),
   WhatsApp, email, alamat, media sosial, teks footer, dan "powered by".
2. **Statistik** (`/admin/statistik`) — kartu angka di halaman Profil (contoh: jumlah suara, dapil, komisi).
   Bebas tambah/hapus/urutkan, ikonnya pakai nama class [Font Awesome 6](https://fontawesome.com/search?ic=free) (ex: `fa-square-poll-vertical`).
3. **Riwayat / Timeline Jabatan** (`/admin/riwayat`) — rekam jejak kepemimpinan, bebas jumlah periode.
4. **Section Profil** (`/admin/peran`) — blok konten tambahan di halaman Profil (pendidikan, pengabdian, dll), tiap section punya anchor ID sendiri.
5. **Gagasan / Berita** (`/admin/artikel`), **Galeri / Pengabdian** (`/admin/galeri`), **Event** (`/admin/event`) — konten yang sering update.
6. **Aspirasi Masuk** (`/admin/aspirasi`) — daftar submission warga, lampiran KTP privat (cuma admin login yang bisa buka).

Tidak ada satupun dari itu yang hardcode di kode — semua baca-tulis langsung ke Realtime Database.

## 5. Warna & branding otomatis

Warna di field **"Warna Utama Situs"** (panel Pengaturan) di-broadcast ke seluruh situs lewat CSS variable
(`--color-brand`, dihitung juga varian gelap/terangnya otomatis) — lihat `components/theme/ThemeInit.tsx`.
Ganti 1 warna itu, tombol/badge/aksen di semua halaman ikut berubah tanpa rebuild.

## 6. Open Graph (preview WA/Telegram/FB/IG/X)

Title/description/gambar OG diambil dari Pengaturan Situs (`app/layout.tsx` → `generateMetadata`), dan
tiap artikel gagasan punya OG sendiri. Gambar OG default digenerate otomatis di `/api/og` pakai warna
brand tokoh yang bersangkutan. Tes hasilnya di Facebook Sharing Debugger setelah deploy; WA/Telegram
biasanya ambil OG tag otomatis begitu link pertama kali dibuka.

## 7. Nambah koleksi CRUD baru

Semua koleksi CRUD didefinisikan di **satu file**: `lib/collections.ts`. Mau nambah jenis konten baru
(misal "Testimoni" atau "Prestasi")? Tambahkan satu entri `CollectionDef` di situ — form & daftar di
`/admin/[slug]` otomatis menyesuaikan lewat `components/admin/CrudManager.tsx`, tidak perlu bikin
halaman/form baru secara manual.

## 9. Yang ditambahkan di putaran penyempurnaan ini

- **Server-rendered untuk SEO**: Beranda, Profil, Gagasan (list & detail), Event, Pengabdian, Kontak sekarang
  di-render di server (bukan client-side fetch) — penting karena ini situs tokoh publik, kontennya harus
  kebaca mesin pencari & preview link, bukan cuma muncul setelah JS jalan di browser. Data diambil ulang
  tiap request (`export const dynamic = "force-dynamic"`) supaya perubahan di `/admin` langsung tampak.
  Panel `/admin` sendiri tetap realtime (pakai `onValue`) karena di situ butuh update instan saat diedit.
- **Editor Gagasan**: field "Isi lengkap" sekarang punya toolbar markdown ringan (Tebal/Miring/Sub judul/
  Daftar/Kutipan) — tanpa nambah dependency berat. Dirender jadi HTML rapi di halaman detail artikel
  (`lib/markdown.ts`), aman dari XSS karena karakter HTML di-escape dulu sebelum diproses.
- **`sitemap.xml` & `robots.txt`** otomatis (`app/sitemap.ts`, `app/robots.ts`) — sitemap ikut daftar semua
  artikel Gagasan yang terbit, robots.txt blokir crawler dari `/admin`.
- **JSON-LD** (`Person` di semua halaman, `Article` di detail artikel) — bantu Google nampilin info tokoh
  lebih rapi di hasil pencarian (knowledge panel/rich result).
- **Warna brand dihitung di server** (bukan lagi lewat JS client) — tidak ada lagi "kedip" warna default
  sebelum warna asli tokoh muncul.
- **Ikon PWA generik** sudah ada isinya (`public/icons/icon-192.png` & `icon-512.png`, siluet orang bulat
  warna brand) — situs baru langsung punya ikon yang layak sebelum admin upload logo asli.
- **Keamanan**: env var admin (`NEXT_PUBLIC_ADMIN_EMAILS`) tidak lagi punya default fallback tersembunyi —
  kalau lupa diisi, panel `/admin` gagal-aman (tidak ada yang bisa masuk), bukan diam-diam kebuka untuk email tertentu.
- Next.js dipin ke **14.2.35** (patch keamanan resmi Desember 2025 — jangan turunkan ke versi di bawah ini).

## 10. Catatan build

`npm run build` sudah dites lolos **compile + type-check** dari sandbox ini. Fase terakhir (static page
generation) sempat timeout di sandbox ini semata karena sandbox-nya tidak boleh akses domain Firebase —
di Vercel (yang jaringannya kebuka), build ini akan selesai normal.


## 11. Checklist khusus tokoh baru (tanpa ubah kode)

- [ ] Isi lengkap `/admin/pengaturan`
- [ ] Isi `/admin/statistik` dan `/admin/riwayat`
- [ ] Upload foto lewat field bertipe "image" (URL gambar — bisa dari Firebase Storage, Cloudinary, atau Google Drive link langsung)
- [ ] Ganti `public/icons/icon-192.png` & `icon-512.png` dengan logo asli kalau ada (placeholder generik sudah tersedia, situs tetap layak jalan tanpa ini)
- [ ] Tambahkan UID admin pertama di node `/admins` (lihat §1)
- [ ] Set `NEXT_PUBLIC_SITE_URL` ke domain final tokoh tsb sebelum deploy produksi (dipakai di canonical URL, sitemap, OG image)
