import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { hexToRgbTriplet } from "@/lib/color";

// Signature element situs ini: foto tokoh dibungkus gradasi warna brand
// (tipis di kiri biar wajah tetap kebaca, pekat di kanan buat panggung
// teks) plus kutipan sebagai headline — bukan nama gede doang. Dipakai
// bareng di Beranda & Profil biar identitasnya konsisten.
export default function Hero({ settings: s, showCta = false }: { settings: SiteSettings; showCta?: boolean }) {
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;
  const rgb = hexToRgbTriplet(s.warnaBrand || "#FE5000");
  const headline = s.kutipanHero?.trim();

  if (!s.banner) {
    // Fallback tanpa foto: tetap tampil rapi, bukan kotak kosong.
    return (
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgba(${rgb},0.94), rgba(${rgb},0.75))` }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 space-y-4">
          {s.jabatanBadge && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase">
              {s.jabatanBadge}
            </span>
          )}
          <h1 className="font-display text-white text-3xl md:text-5xl leading-tight max-w-2xl">{namaLengkap}</h1>
          <p className="text-white/85 text-base max-w-xl">{s.deskripsiSingkat}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[21/9] md:min-h-[480px] overflow-hidden bg-gray-950">
      <Image src={s.banner} alt={namaLengkap} fill priority className="object-cover object-[center_18%] md:object-center" />

      {/* Mobile: gradasi dari bawah (gelap/brand) ke atas (bening) — teks nangkring di bawah foto */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: `linear-gradient(to top, rgba(${rgb},0.97) 0%, rgba(${rgb},0.85) 22%, rgba(${rgb},0.35) 48%, rgba(${rgb},0.08) 68%, transparent 85%)` }}
      />
      {/* Desktop: gradasi dari kiri (tipis, wajah kebaca) ke kanan (pekat, panggung teks) */}
      <div
        className="hidden md:block absolute inset-0"
        style={{ background: `linear-gradient(100deg, rgba(${rgb},0.10) 0%, rgba(${rgb},0.22) 38%, rgba(${rgb},0.68) 62%, rgba(${rgb},0.95) 84%)` }}
      />

      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="w-full md:w-[54%] md:ml-auto px-6 pb-8 sm:px-10 sm:pb-12 md:px-12 md:py-10">
          {s.jabatanBadge && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[11px] font-semibold tracking-widest uppercase mb-4">
              <i className="fa-solid fa-circle-check text-[10px]" /> {s.jabatanBadge}
            </span>
          )}

          {headline ? (
            <div className="relative">
              <span className="font-display absolute -top-6 -left-1 text-6xl md:text-7xl text-white/20 select-none leading-none" aria-hidden>&ldquo;</span>
              <h1 className="font-display italic text-white text-2xl sm:text-3xl md:text-4xl leading-snug relative">{headline}</h1>
            </div>
          ) : (
            <h1 className="font-display text-white text-3xl sm:text-4xl md:text-5xl leading-tight">{namaLengkap}</h1>
          )}

          <p className="mt-4 font-semibold text-white/95 text-base md:text-lg tracking-tight">
            {namaLengkap}
          </p>
          {s.deskripsiSingkat && <p className="mt-1.5 text-white/75 text-sm md:text-[15px] leading-relaxed max-w-md">{s.deskripsiSingkat}</p>}

          {showCta && (
            <div className="flex flex-wrap gap-3 pt-6">
              <Link href="/profil" className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                Profil Selengkapnya
              </Link>
              <Link href="/aspirasi" className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                Kirim Aspirasi
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
