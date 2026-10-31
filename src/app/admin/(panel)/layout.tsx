import { AdminNav } from "@/components/admin/admin-nav";
import { SITE_NAME } from "@/lib/constants";
import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-ufro-purple text-white px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-semibold">
          Panel — {SITE_NAME}
        </Link>
        <Link href="/" className="text-sm text-white/80 hover:text-white">
          Ver sitio público →
        </Link>
      </div>
      <div className="flex flex-col md:flex-row">
        <AdminNav rol={session?.user?.rol} />
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}