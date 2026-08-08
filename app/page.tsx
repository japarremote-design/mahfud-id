import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { getAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [s, events, artikel, galeri] = await Promise.all([
    getSettings(),
    getAll<any>("event"),
    getAll<any>("artikel"),
    getAll<any>("galeri"),
  ]);

  const upcomingEvents = events.filter((e) => e.status === "akan datang").slice(0, 3);
  const latestArtikel = artikel.filter((a) => a.status === "terbit").slice(0, 4);
  const latestGaleri = galeri.slice(0, 4);
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;

  return (
    <div className="space-y-16">
      <section className="bg-white">
        {s.banner && (
          <div className="w-full relative bg-gray-950 aspect-[21/9] md:aspect-[3/1]">
            <Image src={s.banner} alt={namaLengkap} fill className="object-cover object-center" priority />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
          {s.jabatanBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand/20 text-brand-dark text-xs font-semibold tracking-wide">
              <i className="fa-solid fa-circle-check text-[10px]" /> {s.jabatanBadge}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{namaLengkap}</h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl">{s.deskripsiSingkat}</p>
          <div className="flex gap-3 pt-2">
            <Link href="/profil" className="bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              Profil Selengkapnya
            </Link>
            <Link href="/aspirasi" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-sm">
              Kirim Aspirasi
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Agenda</span>
              <h2 className="text-2xl font-extrabold text-gray-900">Event Terdekat</h2>
            </div>
            <Link href="/event" className="text-sm font-semibold text-brand hover:underline">Semua Event →</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
              <i className="fa-solid fa-calendar-xmark text-3xl mb-3" />
              <p className="text-sm">Belum ada agenda terjadwal saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">{ev.tanggal}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-2">{ev.judul}</h3>
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-location-dot" /> {ev.lokasi}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Dokumentasi</span>
              <h2 className="text-2xl font-extrabold text-gray-900">Pengabdian Terbaru</h2>
            </div>
            <Link href="/pengabdian" className="text-sm font-semibold text-brand hover:underline">Foto lainnya →</Link>
          </div>
          {latestGaleri.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada dokumentasi.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestGaleri.map((g) => (
                <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  {g.gambar1 && <Image src={g.gambar1} alt={g.judul} fill className="object-cover" />}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-[11px] font-semibold line-clamp-1">{g.judul}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-gray-900 rounded-3xl p-10 text-center text-white space-y-4">
          <span className="text-xs font-bold text-brand uppercase tracking-wide">Suara Anda Penting</span>
          <h2 className="text-2xl md:text-3xl font-extrabold">Sampaikan Aspirasi Anda</h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            Setiap keluhan, ide, dan usulan warga adalah amanah yang akan diperjuangkan.
          </p>
          <Link href="/aspirasi" className="inline-block bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-xl text-sm">
            KIRIM ASPIRASI
          </Link>
        </section>

        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Gagasan & Berita</span>
              <h2 className="text-2xl font-extrabold text-gray-900">Terbaru</h2>
            </div>
            <Link href="/gagasan" className="text-sm font-semibold text-brand hover:underline">Gagasan lainnya →</Link>
          </div>
          {latestArtikel.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada artikel diterbitkan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {latestArtikel.map((a) => (
                <Link
                  key={a.id}
                  href={a.isExternal ? a.sourceUrl : `/gagasan/${a.slug}`}
                  target={a.isExternal ? "_blank" : undefined}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition flex gap-4"
                >
                  {a.cover && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Image src={a.cover} alt={a.judul} fill className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {a.isExternal && <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Tautan Luar</span>}
                    <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-2">{a.judul}</h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{a.ringkasan}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
