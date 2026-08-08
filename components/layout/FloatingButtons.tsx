import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

export default function FloatingButtons({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-3">
      {settings.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl animate-pulse hover:animate-none transition"
        >
          <i className="fa-brands fa-whatsapp text-2xl" />
        </a>
      )}
      <Link
        href="/aspirasi"
        aria-label="Kirim Aspirasi"
        className="w-14 h-14 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-xl transition"
      >
        <i className="fa-solid fa-pen-to-square text-xl" />
      </Link>
    </div>
  );
}
