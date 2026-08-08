import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import AspirasiForm from "@/components/section/AspirasiForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Kirim Aspirasi", alternates: { canonical: `${s.siteUrl}/aspirasi` } };
}

export default function AspirasiPage() {
  return <AspirasiForm />;
}
