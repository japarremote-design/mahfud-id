// Daftar email yang boleh masuk /admin. Diset lewat env var ADMIN_EMAILS
// (pisah koma), dibaca di client — cocokkan juga di database.rules.json
// lewat node /admins/{uid} supaya proteksinya nyata (bukan cuma UI).
export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Sengaja TIDAK ada default fallback email di sini. Kalau
// NEXT_PUBLIC_ADMIN_EMAILS belum diisi di .env, daftar ini kosong dan
// TIDAK ADA yang bisa masuk /admin — gagal aman (fail-closed), bukan
// diam-diam kasih akses ke email siapapun.

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
