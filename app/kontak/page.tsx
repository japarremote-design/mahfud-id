import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const SOSMED: { key: "facebook" | "instagram" | "telegram" | "twitter" | "tiktok"; icon: string }[] = [
  { key: "facebook", icon: "fa-facebook" },
  { key: "instagram", icon: "fa-instagram" },
  { key: "telegram", icon: "fa-telegram" },
  { key: "twitter", icon: "fa-x-twitter" },
  { key: "tiktok", icon: "fa-tiktok" },
];

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Kontak", alternates: { canonical: `${s.siteUrl}/kontak` } };
}

export default async function KontakPage() {
  const s = await getSettings();
  const activeSosmed = SOSMED.filter((m) => s[m.key]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-brand uppercase tracking-wide">Kontak</span>
        <h1 className="text-3xl font-extrabold text-gray-900">Hubungi Kami</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
        {s.alamat && (
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-location-dot text-brand mt-1" />
            <p className="text-sm text-gray-700 whitespace-pre-line">{s.alamat}</p>
          </div>
        )}
        {s.email && (
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-envelope text-brand mt-1" />
            <a href={`mailto:${s.email}`} className="text-sm text-gray-700 hover:text-brand">{s.email}</a>
          </div>
        )}
        {s.whatsapp && (
          <div className="flex items-start gap-3">
            <i className="fa-brands fa-whatsapp text-brand mt-1" />
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-brand">Chat WhatsApp Tim</a>
          </div>
        )}
        {activeSosmed.length > 0 && (
          <div className="flex gap-4 pt-2 text-xl text-gray-400">
            {activeSosmed.map((m) => (
              <a key={m.key} href={s[m.key]} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                <i className={`fa-brands ${m.icon}`} />
              </a>
            ))}
          </div>
        )}
        {!s.alamat && !s.email && !s.whatsapp && activeSosmed.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Isi data kontak dari panel /admin/pengaturan.</p>
        )}
      </div>
    </div>
  );
}
