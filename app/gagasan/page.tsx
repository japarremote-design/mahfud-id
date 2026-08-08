import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Gagasan & Berita", alternates: { canonical: `${s.siteUrl}/gagasan` } };
}

export default async function GagasanPage() {
  const artikel = await getAll<any>("artikel");
  const list = artikel.filter((a) => a.status === "terbit");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Gagasan & Berita</span>
        <h1 className="text-3xl font-extrabold text-gray-900">Koridor Perjuangan & Visi</h1>
      </div>

      {list.length === 0 && <p className="text-center text-gray-400 text-sm">Belum ada artikel diterbitkan.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((a) => (
          <Link
            key={a.id}
            href={a.isExternal ? a.sourceUrl : `/gagasan/${a.slug}`}
            target={a.isExternal ? "_blank" : undefined}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition"
          >
            {a.cover && (
              <div className="relative h-44 bg-gray-100">
                <Image src={a.cover} alt={a.judul} fill className="object-cover" />
              </div>
            )}
            <div className="p-5 space-y-2">
              {a.isExternal ? (
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Tautan Luar — {a.sourceName}</span>
              ) : null}
              <h3 className="font-bold text-gray-900">{a.judul}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{a.ringkasan}</p>
              <span className="text-brand text-xs font-semibold">Baca Selengkapnya →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
