import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getAll } from "@/lib/data";
import GaleriGrid from "@/components/section/GaleriGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Pengabdian", alternates: { canonical: `${s.siteUrl}/pengabdian` } };
}

export default async function PengabdianPage() {
  const galeri = await getAll<any>("galeri");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Dokumentasi</span>
        <h1 className="text-3xl font-extrabold text-gray-900">Rekam Jejak Pengabdian</h1>
      </div>
      <GaleriGrid data={galeri} />
    </div>
  );
}
