"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Beranda", icon: "fa-house" },
  { href: "/profil", label: "Profil", icon: "fa-user" },
  { href: "/gagasan", label: "Gagasan", icon: "fa-lightbulb" },
  { href: "/pengabdian", label: "Bakti", icon: "fa-hands-holding-child" },
  { href: "/kontak", label: "Lainnya", icon: "fa-ellipsis" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 grid grid-cols-5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {ITEMS.map((it) => {
        const active = pathname === it.href;
        return (
          <Link key={it.href} href={it.href} className={`flex flex-col items-center justify-center py-2 text-[10px] font-semibold ${active ? "text-brand" : "text-gray-400"}`}>
            <i className={`fa-solid ${it.icon} text-base mb-0.5`} />
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
