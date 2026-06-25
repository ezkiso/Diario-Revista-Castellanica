"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, BookOpen, Users, LogOut } from "lucide-react";

const allLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/articulos", label: "Artículos", icon: FileText, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/revistas", label: "Revistas", icon: BookOpen, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.rol;

  const links = allLinks.filter(link => link.roles.includes(userRole as string));

  return (
    <aside className="w-full md:w-56 shrink-0 border-r bg-muted/30 min-h-[calc(100vh-4rem)] p-4">
      <nav className="flex flex-col gap-1" aria-label="Administración">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href || (href !== "/admin" && pathname.startsWith(href))
                ? "bg-ufro-purple text-white"
                : "hover:bg-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <Button
          variant="ghost"
          className="justify-start mt-4 text-destructive hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </nav>
    </aside>
  );
}
