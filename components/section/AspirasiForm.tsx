"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { ref as dbRef, push, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { useSettings } from "@/lib/hooks";

export default function AspirasiForm() {
  const s = useSettings();
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [honeypot, setHoneypot] = useState(""); // anti-bot: bila terisi, kemungkinan bot

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return; // diam-diam tolak submission bot
    const form = e.currentTarget;
    setStatus("submitting");

    try {
      const fd = new FormData(form);
      const ktpFile = (fd.get("ktp") as File) || null;

      let ktpPath = "";
      if (ktpFile && ktpFile.size > 0) {
        const path = `aspirasi-ktp/${Date.now()}_${ktpFile.name}`;
        const snap = await uploadBytes(storageRef(storage, path), ktpFile);
        ktpPath = snap.ref.fullPath; // path privat, BUKAN url publik — cuma admin yg login bisa baca (lihat storage.rules)
      }

      const payload = {
        nama: fd.get("nama"),
        alamat: fd.get("alamat"),
        desa: fd.get("desa"),
        kecamatan: fd.get("kecamatan"),
        whatsapp: fd.get("whatsapp"),
        aspirasi: fd.get("aspirasi"),
        opdTarget: fd.get("opd"),
        ktpPath,
        status: "baru",
        waktuPengiriman: new Date().toISOString(),
      };

      await set(push(dbRef(db, "aspirasi")), payload);
      setStatus("success");
      form.reset();
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <i className="fa-solid fa-circle-check text-5xl text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900">Terima kasih!</h1>
        <p className="text-gray-500 text-sm">Aspirasi Anda telah berhasil direkam dan akan diperjuangkan oleh {namaLengkap || "tim kami"}.</p>
        <button onClick={() => setStatus("idle")} className="bg-brand text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Kirim aspirasi lain</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
        <div className="text-center mb-8 border-b border-gray-100 pb-6 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-brand mb-1">
            <i className="fa-solid fa-file-pen text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">FORMULIR ASPIRASI {namaLengkap ? `UNTUK ${namaLengkap.toUpperCase()}` : ""}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sarana resmi bagi masyarakat untuk menyampaikan ide, kebutuhan, keluhan, maupun usulan terkait pembangunan dan pelayanan publik.
          </p>
          <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-3">
            <i className="fa-solid fa-shield-halved text-brand mr-1" /> Data pribadi dan identitas Anda dirahasiakan, hanya dapat diakses oleh tim admin resmi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* honeypot anti-bot, disembunyikan dari user asli */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />

          <Field label="Nama Lengkap" name="nama" required />
          <Field label="Alamat / Dusun" name="alamat" required placeholder="Contoh: RT 02 / RW 01, Dusun Klampis" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Desa" name="desa" required />
            <Field label="Kecamatan" name="kecamatan" required />
          </div>
          <Field label="No HP/WA" name="whatsapp" required type="tel" placeholder="08xxxxxxxxxx" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tuliskan Keluhan, Ide, Kritik dan atau Aspirasi Anda <span className="text-red-500">*</span></label>
            <textarea name="aspirasi" rows={4} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
          </div>
          <Field label="Tujuan Dinas atau OPD Terkait" name="opd" required placeholder="Contoh: Dinas PUPR / Dinas Kesehatan" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lampirkan Identitas (KTP)</label>
            <p className="text-xs text-gray-400 mb-2">Format gambar (PNG/JPG). Disimpan privat, hanya admin yang bisa membuka.</p>
            <input type="file" name="ktp" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-dark" />
          </div>

          <button type="submit" disabled={status === "submitting"} className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
            {status === "submitting" ? (
              <><i className="fa-solid fa-spinner animate-spin" /> Mengirim Aspirasi...</>
            ) : (
              <><i className="fa-solid fa-paper-plane" /> Kirim Aspirasi Saya</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, required, type = "text", placeholder }: { label: string; name: string; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
    </div>
  );
}
