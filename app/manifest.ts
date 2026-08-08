import { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;
  return {
    name: `${namaLengkap} — ${s.jabatanBadge}`,
    short_name: s.namaTokoh,
    description: s.deskripsiSingkat,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: s.warnaBrand,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
