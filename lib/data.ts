import { db } from "@/lib/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";

// Helper baca data di SERVER COMPONENT (bukan client hook). Dipakai supaya
// halaman publik (beranda, profil, gagasan, event, pengabdian) ter-render
// di server — penting buat SEO, karena situs tokoh publik butuh kontennya
// kebaca mesin pencari, bukan cuma nongol setelah JS jalan di browser.
export async function getAll<T = any>(path: string): Promise<(T & { id: string })[]> {
  const snap = await get(ref(db, path));
  if (!snap.exists()) return [];
  const val = snap.val();
  return Object.entries(val).map(([id, v]: [string, any]) => ({ id, ...(v as object) })) as (T & { id: string })[];
}

export async function getArtikelBySlug(slug: string) {
  const snap = await get(query(ref(db, "artikel"), orderByChild("slug"), equalTo(slug)));
  if (!snap.exists()) return null;
  const val = snap.val();
  const id = Object.keys(val)[0];
  return { id, ...val[id] };
}

export function sortByUrutan<T extends { urutan?: any }>(list: T[]): T[] {
  return [...list].sort((a, b) => Number(a.urutan || 0) - Number(b.urutan || 0));
}
