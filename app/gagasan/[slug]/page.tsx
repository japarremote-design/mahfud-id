import { getArtikelBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";

async function getArtikel(slug: string) {
  return getArtikelBySlug(slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [artikel, s] = await Promise.all([getArtikel(params.slug), getSettings()]);
  if (!artikel) return {};
  const ogImage = artikel.cover || `${s.siteUrl}/api/og?title=${encodeURIComponent(artikel.judul)}&color=${encodeURIComponent(s.warnaBrand)}`;
  return {
    title: artikel.judul,
    description: artikel.ringkasan,
    alternates: { canonical: `${s.siteUrl}/gagasan/${artikel.slug}` },
    openGraph: {
      title: artikel.judul,
      description: artikel.ringkasan,
      url: `${s.siteUrl}/gagasan/${artikel.slug}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: artikel.judul, description: artikel.ringkasan, images: [ogImage] },
  };
}

export default async function ArtikelDetail({ params }: { params: { slug: string } }) {
  const artikel = await getArtikel(params.slug);
  if (!artikel || artikel.isExternal) return notFound();
  const html = markdownToHtml(artikel.isi || "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artikel.judul,
    description: artikel.ringkasan,
    image: artikel.cover || undefined,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <h1 className="text-3xl font-extrabold text-gray-900">{artikel.judul}</h1>
      {artikel.cover && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
          <Image src={artikel.cover} alt={artikel.judul} fill className="object-cover" />
        </div>
      )}
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h3]:font-bold [&_h3]:text-lg [&_h3]:text-gray-900 [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-light [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_p]:mb-3"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
