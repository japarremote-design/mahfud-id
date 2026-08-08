"use client";
import Image from "next/image";
import { useState } from "react";

export default function GaleriGrid({ data }: { data: any[] }) {
  const [active, setActive] = useState<any>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
        <i className="fa-solid fa-image text-3xl mb-3" />
        <p className="text-sm">Belum ada dokumentasi kegiatan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((g) => (
          <button key={g.id} onClick={() => setActive(g)} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
            {g.gambar1 && <Image src={g.gambar1} alt={g.judul} fill className="object-cover group-hover:scale-105 transition" />}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left">
              <p className="text-white text-[11px] font-semibold line-clamp-1">{g.judul}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-2 gap-2">
              {[active.gambar1, active.gambar2, active.gambar3, active.gambar4].filter(Boolean).map((src: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image src={src} alt={active.judul} fill className="object-cover" />
                </div>
              ))}
            </div>
            <h3 className="font-bold text-gray-900">{active.judul}</h3>
            <p className="text-gray-500 text-xs">{active.lokasi} {active.tanggal && `• ${active.tanggal}`}</p>
            <p className="text-gray-700 text-sm whitespace-pre-line">{active.narasi}</p>
            <button onClick={() => setActive(null)} className="w-full bg-gray-100 hover:bg-gray-200 font-semibold py-2.5 rounded-xl text-sm">TUTUP</button>
          </div>
        </div>
      )}
    </>
  );
}
