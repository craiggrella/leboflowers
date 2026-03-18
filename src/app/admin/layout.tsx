import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin | Mt. Lebanon Flower Sale",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex -mt-16 pt-16">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-6 bg-earth-50 w-full min-w-0 min-h-[50vh]">{children}</div>
    </div>
  );
}
