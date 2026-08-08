import { notFound } from "next/navigation";
import { getCollection } from "@/lib/collections";
import CrudManager from "@/components/admin/CrudManager";

export default function AdminCollectionPage({ params }: { params: { col: string } }) {
  const col = getCollection(params.col);
  if (!col) return notFound();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <CrudManager col={col} />
    </div>
  );
}
