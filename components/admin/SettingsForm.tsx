"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { DEFAULT_SETTINGS, SETTINGS_FORM_GROUPS, SiteSettings } from "@/lib/settings";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function SettingsForm() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  async function handleImageUpload(key: keyof SiteSettings, file: File) {
    setUploadingKey(key);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, [key]: url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingKey(null);
    }
  }

  useEffect(() => {
    const r = ref(db, "pengaturan/umum");
    const unsub = onValue(r, (snap) => {
      setForm(snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.val() } : DEFAULT_SETTINGS);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await set(ref(db, "pengaturan/umum"), form);
      setSavedAt(Date.now());
    } catch (err: any) {
      alert("Gagal simpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Memuat pengaturan...</p>;

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          <i className="fa-solid fa-sliders text-brand mr-2" /> Pengaturan Situs
        </h2>
        <button type="submit" disabled={saving} className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>
      <p className="text-xs text-gray-400 -mt-4">
        Isi semua data tokoh di sini. Nama, gelar, warna, kontak, dan footer di seluruh situs otomatis mengikuti — tidak perlu edit kode.
      </p>
      {savedAt && <p className="text-xs text-green-600">Tersimpan {new Date(savedAt).toLocaleTimeString("id-ID")}</p>}

      {SETTINGS_FORM_GROUPS.map((group) => (
        <div key={group.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">{group.title}</h3>
          {group.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                />
              ) : f.type === "color" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form[f.key] || "#FE5000"}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ) : f.type === "image" ? (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder="Tempel URL, atau upload di sebelah kanan →"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                    />
                    <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-brand-light hover:text-brand-dark text-gray-600 text-xs font-semibold cursor-pointer transition">
                      {uploadingKey === f.key ? (
                        <><i className="fa-solid fa-spinner animate-spin" /> Upload...</>
                      ) : (
                        <><i className="fa-solid fa-cloud-arrow-up" /> Upload</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingKey === f.key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(f.key, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                />
              )}
              {f.type === "image" && form[f.key] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form[f.key]} alt="" className="mt-2 h-24 rounded-lg object-cover border border-gray-200" />
              )}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}
