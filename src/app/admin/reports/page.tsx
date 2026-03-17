export default function ReportsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Sales Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-3">Revenue by Category</h2>
          <p className="text-earth-500 text-sm">
            Connect Supabase to view real-time sales data by category.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-3">Orders by Day</h2>
          <p className="text-earth-500 text-sm">
            Connect Supabase to view order volume over time.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-3">Top Products</h2>
          <p className="text-earth-500 text-sm">
            Connect Supabase to see which products are selling the most.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-3">Payment Methods</h2>
          <p className="text-earth-500 text-sm">
            Connect Supabase to see breakdown by online, in-person card, cash, and check.
          </p>
        </div>
      </div>
    </div>
  );
}
