import { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { getAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, artikel] = await Promise.all([getSettings(), getAll<any>("artikel")]);
  const base = s.siteUrl.replace(/\/$/, "");

  const staticRoutes = ["", "/profil", "/gagasan", "/pengabdian", "/event", "/kontak", "/aspirasi"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const artikelRoutes = artikel
    .filter((a) => a.status === "terbit" && !a.isExternal && a.slug)
    .map((a) => ({
      url: `${base}/gagasan/${a.slug}`,
      lastModified: a._updatedAt ? new Date(a._updatedAt) : new Date(),
    }));

  return [...staticRoutes, ...artikelRoutes];
}
