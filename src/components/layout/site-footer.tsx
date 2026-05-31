import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-ufro-blue text-white mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif text-xl font-bold mb-2">{SITE_NAME}</h2>
            <p className="text-sm text-white/80 max-w-md">
              Medio digital de la Carrera de Pedagogía en Castellano y Comunicación.
              Noticias, opinión, cartas al director, difusión y la Revista Castellánica.
            </p>
          </div>
          <div className="text-sm text-white/80">
            <p className="font-semibold text-white mb-1">Universidad de La Frontera</p>
            <p>Av. Francisco Salazar 01145, Temuco, Chile</p>
            <p className="mt-4">© {year} {SITE_NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
