import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Event & Kegiatan", alternates: { canonical: `${s.siteUrl}/event` } };
}

export default async function EventPage() {
  const events = await getAll<any>("event");
  const sorted = [...events].sort((a, b) => (a.tanggal || "").localeCompare(b.tanggal || ""));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Agenda</span>
        <h1 className="text-3xl font-extrabold text-gray-900">Event & Kegiatan</h1>
      </div>

      {sorted.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
          <i className="fa-solid fa-calendar-xmark text-3xl mb-3" />
          <p className="text-sm">Belum ada agenda terjadwal.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sorted.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">{ev.tanggal}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ev.status === "selesai" ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600"}`}>{ev.status}</span>
            </div>
            <h3 className="font-bold text-gray-900">{ev.judul}</h3>
            <p className="text-gray-500 text-sm">{ev.deskripsi}</p>
            <p className="text-gray-400 text-xs flex items-center gap-1"><i className="fa-solid fa-location-dot" /> {ev.lokasi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
