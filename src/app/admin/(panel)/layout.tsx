import { AdminNav } from "@/components/admin/admin-nav";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-ufro-blue text-white px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-semibold">
          Panel — {SITE_NAME}
        </Link>
        <Link href="/" className="text-sm text-white/80 hover:text-white">
          Ver sitio público →
        </Link>
      </div>
      <div className="flex flex-col md:flex-row">
        <AdminNav />
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
