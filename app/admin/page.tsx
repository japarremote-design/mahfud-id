import Link from "next/link";
import { COLLECTIONS } from "@/lib/collections";

export default function AdminDashboard() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>

      <Link href="/admin/pengaturan" className="block bg-brand hover:bg-brand-dark text-white rounded-xl shadow-sm p-5 flex items-center gap-3 transition">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center"><i className="fa-solid fa-sliders" /></div>
        <div>
          <span className="font-bold text-sm block">Pengaturan Situs</span>
          <span className="text-xs text-white/80">Identitas tokoh, warna, kontak, footer — isi sekali di sini</span>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/admin/${c.slug}`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-light text-brand flex items-center justify-center"><i className={`fa-solid ${c.icon}`} /></div>
            <span className="font-semibold text-gray-800 text-sm">{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
