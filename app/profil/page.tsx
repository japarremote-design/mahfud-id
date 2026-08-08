import Image from "next/image";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getAll, sortByUrutan } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;
  return { title: "Profil", description: s.deskripsiSingkat, alternates: { canonical: `${s.siteUrl}/profil` } };
}

export default async function ProfilPage() {
  const [s, peran, statistik, riwayat] = await Promise.all([
    getSettings(),
    getAll<any>("peran"),
    getAll<any>("statistik"),
    getAll<any>("riwayat"),
  ]);

  const sortedPeran = sortByUrutan(peran);
  const sortedStatistik = sortByUrutan(statistik);
  const sortedRiwayat = sortByUrutan(riwayat);
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {s.banner && (
          <div className="w-full relative bg-gray-950 aspect-[21/9] md:aspect-[3/1]">
            <Image src={s.banner} alt={namaLengkap} fill className="object-cover object-center" />
          </div>
        )}
        <div className="p-6 md:p-8 space-y-3">
          {s.jabatanBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand/20 text-brand-dark text-xs font-semibold tracking-wide">
              <i className="fa-solid fa-circle-check text-[10px]" /> {s.jabatanBadge}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{namaLengkap}</h1>
          <p className="text-gray-600 text-base leading-relaxed">{s.deskripsiSingkat}</p>
        </div>
      </div>

      {sortedStatistik.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedStatistik.map((st) => (
            <div key={st.id} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-light text-brand flex items-center justify-center text-xl"><i className={`fa-solid ${st.icon}`} /></div>
              <div>
                <div className="text-2xl font-black text-gray-900">{st.angka}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{st.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedRiwayat.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center"><i className="fa-solid fa-star-of-life" /></div>
            <h3 className="text-xl font-bold text-gray-900">Rekam Jejak Kepemimpinan</h3>
          </div>
          <div className="relative border-l-2 border-brand-light ml-4 space-y-6">
            {sortedRiwayat.map((r) => (
              <div key={r.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand border-4 border-white shadow" />
                <span className="inline-block bg-brand-light text-brand-dark text-xs font-bold px-2 py-0.5 rounded mb-1">{r.periode}</span>
                <h4 className="font-bold text-gray-900 text-base">{r.judul}</h4>
                <p className="text-gray-500 text-sm">{r.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedPeran.map((p) => (
        <div key={p.id} id={p.anchorId} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 scroll-mt-20 space-y-3">
          {p.eyebrow && <span className="text-xs font-bold text-brand uppercase tracking-wide">{p.eyebrow}</span>}
          <h3 className="text-xl font-bold text-gray-900">{p.judul}</h3>
          {p.gambar && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <Image src={p.gambar} alt={p.judul} fill className="object-cover" />
            </div>
          )}
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{p.isi}</p>
        </div>
      ))}

      {sortedPeran.length === 0 && sortedStatistik.length === 0 && sortedRiwayat.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
          <i className="fa-solid fa-pen-to-square text-3xl mb-3" />
          <p className="text-sm">Isi Statistik, Riwayat, dan Section Profil dari panel /admin agar halaman ini lengkap.</p>
        </div>
      )}
    </div>
  );
}
