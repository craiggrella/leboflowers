import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // TODO: Fetch from Supabase
  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Order #{id}</h1>

      <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
        <p className="text-earth-500 text-sm">
          Connect Supabase to view full order details. Order ID: {id}
        </p>
      </div>
    </div>
  );
}
