import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import FloatingButtons from "@/components/layout/FloatingButtons";
import { getSettings } from "@/lib/settings";
import { shade, hexToRgbTriplet } from "@/lib/color";

// Fraunces buat headline/kutipan (serif hangat, bukan sans generik) +
// Plus Jakarta Sans buat body/UI — dipilih sengaja, bukan default AI.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600"], style: ["normal", "italic"] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] });

// Data tokoh dibaca ulang tiap request, bukan di-cache saat build —
// supaya perubahan di panel /admin langsung tampak tanpa perlu redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;
  const desc = s.deskripsiSingkat;
  const ogImage = `${s.siteUrl}/api/og?title=${encodeURIComponent(namaLengkap)}&subtitle=${encodeURIComponent(s.jabatanBadge)}&color=${encodeURIComponent(s.warnaBrand)}`;

  return {
    metadataBase: new URL(s.siteUrl),
    title: { default: namaLengkap, template: `%s — ${namaLengkap}` },
    description: desc,
    applicationName: namaLengkap,
    manifest: "/manifest.webmanifest",
    themeColor: s.warnaBrand,
    icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: s.siteUrl,
      siteName: namaLengkap,
      title: namaLengkap,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: namaLengkap,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const brand = s.warnaBrand || "#FE5000";
  const namaLengkap = `${s.namaTokoh}${s.gelarSingkat ? `, ${s.gelarSingkat}` : ""}`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: namaLengkap,
    jobTitle: s.jabatanBadge,
    description: s.deskripsiSingkat,
    url: s.siteUrl,
    image: s.banner || undefined,
    sameAs: [s.facebook, s.instagram, s.twitter, s.tiktok, s.telegram, s.youtube].filter(Boolean),
  };

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Warna brand dihitung & di-inject di server — tampil benar sejak
            render pertama, tanpa "kedip" warna default lalu ganti di client. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--color-brand:${brand};--color-brand-dark:${shade(brand, -20)};--color-brand-light:${shade(brand, 88)};--color-brand-rgb:${hexToRgbTriplet(brand)};}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className={`${fraunces.variable} ${plusJakarta.variable} bg-gray-50 text-gray-800 font-sans antialiased`}>
        <Navbar settings={s} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={s} />
        <BottomNav />
        <FloatingButtons settings={s} />
      </body>
    </html>
  );
}
