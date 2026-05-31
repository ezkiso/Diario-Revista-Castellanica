import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-40 shadow-sm">
      <div className="bg-ufro-blue text-white text-xs py-1.5">
        <div className="container mx-auto px-4 text-center">
          Universidad de La Frontera — Temuco, Chile · Pedagogía en Castellano y Comunicación
        </div>
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/" className="flex items-center gap-4 group" aria-label="Inicio">
            <div className="relative h-14 w-14 shrink-0 rounded-full bg-ufro-gray border-2 border-ufro-red overflow-hidden flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Logo Universidad de La Frontera"
                width={56}
                height={56}
                className="object-contain p-1"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ufro-red font-semibold">
                Universidad de La Frontera
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-ufro-blue group-hover:text-ufro-red transition-colors">
                {SITE_NAME}
              </h1>
            </div>
          </Link>
        </div>
      </div>
      <nav
        className="border-t border-border bg-ufro-gray/50"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap gap-1 py-2">
            <li>
              <Link
                href="/"
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded hover:bg-white hover:text-ufro-red transition-colors"
                )}
              >
                Inicio
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-sm font-medium rounded hover:bg-white hover:text-ufro-red transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
