import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-ufro-purple text-white mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
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

          {/* Redes sociales */}
          <div>
            <p className="font-semibold text-white mb-3">Síguenos</p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/castellanoufro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Castellanocomunica777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <path d="m10 15 5-3-5-3z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}