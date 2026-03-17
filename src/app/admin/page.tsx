import { ShoppingBag, DollarSign, Package, Users } from "lucide-react";

export default function AdminDashboard() {
  // TODO: Replace with real Supabase queries when connected
  const stats = [
    { label: "Total Orders", value: "0", icon: ShoppingBag, color: "bg-garden-100 text-garden-700" },
    { label: "Total Revenue", value: "$0.00", icon: DollarSign, color: "bg-sunshine-100 text-sunshine-600" },
    { label: "Products", value: "101", icon: Package, color: "bg-lavender-100 text-lavender-600" },
    { label: "Pending Orders", value: "0", icon: Users, color: "bg-petal-100 text-petal-600" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-earth-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-earth-900">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-earth-900 mb-3">Getting Started</h2>
        <ul className="space-y-2 text-sm text-earth-600">
          <li>1. Connect your Supabase project and run the migration</li>
          <li>2. Set up your Stripe API keys in .env.local</li>
          <li>3. Create admin accounts in Supabase Auth</li>
          <li>4. Configure the Stripe webhook endpoint</li>
          <li>5. Start accepting orders!</li>
        </ul>
      </div>
    </div>
  );
}
