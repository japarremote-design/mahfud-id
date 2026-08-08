"use client";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { ref, push, remove, onValue, update } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { CollectionDef } from "@/lib/collections";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Row = { id: string; [k: string]: any };

export default function CrudManager({ col }: { col: CollectionDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [openingFile, setOpeningFile] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  async function handleImageUpload(key: string, file: File) {
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

  async function handleOpenFile(path: string) {
    setOpeningFile(path);
    try {
      const url = await getDownloadURL(storageRef(storage, path));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      alert("Tidak bisa membuka lampiran (mungkin akun ini belum diizinkan baca Storage — cek storage.rules): " + err.message);
    } finally {
      setOpeningFile(null);
    }
  }

  useEffect(() => {
    const r = ref(db, col.slug);
    const unsub = onValue(r, (snap) => {
      const val = snap.val() || {};
      const list: Row[] = Object.entries(val).map(([id, v]: [string, any]) => ({ id, ...(v as object) }));
      list.sort((a, b) => (b._createdAt || 0) - (a._createdAt || 0));
      setRows(list);
    });
    return () => unsub();
  }, [col.slug]);

  function openNew() {
    setEditing({ id: "" });
    setForm(Object.fromEntries(col.fields.map((f) => [f.key, f.type === "boolean" ? false : ""])));
  }

  function openEdit(row: Row) {
    setEditing(row);
    setForm(Object.fromEntries(col.fields.map((f) => [f.key, row[f.key] ?? (f.type === "boolean" ? false : "")])));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const missing = col.fields.filter((f) => f.required && !String(form[f.key] ?? "").trim());
      if (missing.length) {
        alert("Wajib diisi: " + missing.map((f) => f.label).join(", "));
        setSaving(false);
        return;
      }
      if (editing?.id) {
        await update(ref(db, `${col.slug}/${editing.id}`), { ...form, _updatedAt: Date.now() });
      } else {
        await push(ref(db, col.slug), { ...form, _createdAt: Date.now(), _updatedAt: Date.now() });
      }
      setEditing(null);
    } catch (err: any) {
      alert("Gagal simpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus data ini? Tidak bisa dibatalkan.")) return;
    await remove(ref(db, `${col.slug}/${id}`));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          <i className={`fa-solid ${col.icon} text-brand mr-2`} /> {col.label}
        </h2>
        <button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <i className="fa-solid fa-plus mr-1" /> Tambah Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 shadow-sm">
        {rows.length === 0 && <p className="p-6 text-sm text-gray-400">Belum ada data. Klik &quot;Tambah Baru&quot;.</p>}
        {rows.map((row) => {
          const imageField = col.fields.find((f) => f.type === "image");
          const thumb = imageField ? row[imageField.key] : null;
          return (
            <div key={row.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100 shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{row[col.listTitleKey] || "(tanpa judul)"}</p>
                  {row.status && <span className="text-[10px] uppercase font-bold text-brand bg-brand-light px-2 py-0.5 rounded">{row.status}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(row)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Edit</button>
                <button onClick={() => handleDelete(row.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">Hapus</button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-4 my-8">
            <h3 className="font-bold text-lg text-gray-900">{editing.id ? "Edit" : "Tambah"} {col.label}</h3>
            {col.fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === "textarea" || f.type === "richtext" ? (
                  <div>
                    {f.type === "richtext" && (
                      <div className="flex gap-1 mb-1.5">
                        {[
                          { label: "B", wrap: "**", title: "Tebal" },
                          { label: "I", wrap: "*", title: "Miring" },
                          { label: "H2", prefix: "## ", title: "Sub judul" },
                          { label: "•", prefix: "- ", title: "Daftar" },
                          { label: "❝", prefix: "> ", title: "Kutipan" },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            type="button"
                            title={btn.title}
                            onClick={() => {
                              const el = document.getElementById(`rt-${f.key}`) as HTMLTextAreaElement | null;
                              const current: string = form[f.key] ?? "";
                              if (!el) return;
                              const start = el.selectionStart ?? current.length;
                              const end = el.selectionEnd ?? current.length;
                              const selected = current.slice(start, end);
                              let next = current;
                              if (btn.wrap) {
                                next = current.slice(0, start) + btn.wrap + selected + btn.wrap + current.slice(end);
                              } else if (btn.prefix) {
                                next = current.slice(0, start) + btn.prefix + selected + current.slice(end);
                              }
                              setForm({ ...form, [f.key]: next });
                            }}
                            className="w-7 h-7 text-xs font-bold rounded bg-gray-100 hover:bg-brand-light hover:text-brand-dark text-gray-600"
                          >
                            {btn.label}
                          </button>
                        ))}
                        <span className="text-[10px] text-gray-400 self-center ml-1">Markdown ringan: **tebal**, *miring*, ## judul, - daftar, &gt; kutipan</span>
                      </div>
                    )}
                    <textarea
                      id={f.type === "richtext" ? `rt-${f.key}` : undefined}
                      rows={f.type === "richtext" ? 8 : 3}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none font-mono"
                    />
                  </div>
                ) : f.type === "select" ? (
                  <select
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">-- pilih --</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={!!form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                    className="w-5 h-5"
                  />
                ) : f.type === "file" ? (
                  form[f.key] ? (
                    <button
                      type="button"
                      onClick={() => handleOpenFile(form[f.key])}
                      disabled={openingFile === form[f.key]}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-brand-light text-brand-dark hover:bg-brand hover:text-white transition disabled:opacity-50"
                    >
                      <i className="fa-solid fa-file-shield mr-1" />
                      {openingFile === form[f.key] ? "Membuka..." : "Lihat Lampiran"}
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400">Tidak ada lampiran.</p>
                  )
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                        value={form[f.key] ?? ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.type === "image" ? "Tempel URL, atau upload di sebelah kanan →" : f.placeholder}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                      />
                      {f.type === "image" && (
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
                      )}
                    </div>
                    {f.type === "image" && form[f.key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form[f.key]} alt="" className="mt-2 h-20 rounded-lg object-cover border border-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded-xl disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
