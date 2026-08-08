// Upload gambar langsung dari panel admin ke Cloudinary (unsigned upload
// preset) — admin tinggal pilih file, URL hasil upload otomatis keisi
// di field gambar. Butuh 2 env var (lihat .env.local.example).
//
// CATATAN KEAMANAN: unsigned upload preset bisa dipanggil siapa saja yang
// tahu nama preset-nya (bukan cuma dari panel admin ini) — itu batasan
// bawaan Cloudinary unsigned upload, bukan bug di kode ini. Untuk situs
// tokoh publik ini risikonya rendah (orang lain paling upload gambar,
// bukan curi data), tapi kalau mau lebih ketat pakai signed upload lewat
// endpoint server sendiri.
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary belum disetel — isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di .env.local");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Upload ke Cloudinary gagal");
  }

  const data = await res.json();
  return data.secure_url as string;
}
