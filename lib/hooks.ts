"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export function useCollection<T = any>(path: string) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, path);
    const unsub = onValue(r, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, v]: [string, any]) => ({ id, ...(v as object) })) as (T & { id: string })[];
      setData(list);
      setLoading(false);
    });
    return () => unsub();
  }, [path]);

  return { data, loading };
}

// Realtime — dipakai di Navbar/Footer/halaman publik supaya begitu admin
// ubah data di panel, tampilan situs ikut berubah tanpa reload/rebuild.
export function useSettings(): SiteSettings & { loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "pengaturan/umum");
    const unsub = onValue(r, (snap) => {
      setSettings(snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.val() } : DEFAULT_SETTINGS);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { ...settings, loading };
}
