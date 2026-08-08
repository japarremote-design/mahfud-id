import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings: s }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-20 border-t border-gray-850 pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start font-black text-lg tracking-wider">
            <span className="bg-brand text-white px-2 py-0.5 rounded-md text-sm">{s.logoPart1}</span>
            <span className="text-white pl-1 text-sm">{s.logoPart2}</span>
          </div>
          <p className="text-[11px] text-gray-500">
            {s.namaTokoh}{s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}{s.footerKeterangan ? ` — ${s.footerKeterangan}` : ""}
          </p>
        </div>
        <div className="text-[11px] text-gray-500 space-y-1 md:text-right">
          <p>&copy; {s.tahunMulaiCopyright}{s.tahunMulaiCopyright !== String(year) ? ` – ${year}` : ""}. Hak Cipta Dilindungi.</p>
          {s.poweredByNama && (
            <p className="text-[10px] text-gray-600">
              Powered by{" "}
              <a href={s.poweredByUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand underline">
                {s.poweredByNama}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
