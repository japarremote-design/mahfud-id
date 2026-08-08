import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

const MENU = [
  { href: "/profil", label: "PROFIL" },
  { href: "/gagasan", label: "GAGASAN" },
  { href: "/pengabdian", label: "PENGABDIAN" },
  { href: "/event", label: "EVENT" },
  { href: "/kontak", label: "KONTAK" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-1.5 group">
            <i className="fa-solid fa-flag text-brand text-xl group-hover:scale-110 transition" />
            <div className="flex items-center font-black text-xl tracking-wider">
              <span className="bg-brand text-white px-2 py-0.5 rounded-md shadow-sm">{settings.logoPart1}</span>
              <span className="text-gray-900 pl-1">{settings.logoPart2}</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {MENU.map((m) => (
              <Link key={m.href} href={m.href} className="text-gray-600 hover:text-brand font-medium transition text-sm">
                {m.label}
              </Link>
            ))}
          </div>

          <Link href="/aspirasi" className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-full text-sm font-semibold transition shadow-sm">
            KIRIM ASPIRASI
          </Link>
        </div>
      </div>
    </nav>
  );
}
