"use client";
// src/components/ui/back-button.tsx
// Botón flotante sticky que aparece al hacer scroll.
// Uso en la página del artículo:
//   <BackButton label="Noticias" href="/noticias" />
 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface BackButtonProps {
  /** Texto que aparece junto al ícono, ej: "Noticias" */
  label: string;
  /** Ruta destino, ej: "/noticias" */
  href: string;
  /** Si true usa router.back() en vez de href */
  useHistory?: boolean;
}
 
export function BackButton({ label, href, useHistory = false }: BackButtonProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    // Pequeño delay para no flashear al cargar
    const timer = setTimeout(() => setVisible(true), 300);
 
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
 
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
 
  const handleClick = (e: React.MouseEvent) => {
    if (useHistory) {
      e.preventDefault();
      router.back();
    }
  };
 
  return (
    <div
      className={cn(
        // Posición fija, esquina inferior izquierda
        "fixed bottom-6 left-6 z-50",
        // Transición de entrada
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          // Base del botón
          "group flex items-center gap-2 rounded-full",
          "bg-white text-gray-800 shadow-lg shadow-black/10",
          "border border-gray-200",
          // Padding adaptativo: más pequeño → solo ícono cuando NO hay scroll
          "transition-all duration-300 ease-out",
          scrolled
            ? "px-4 py-2.5 pr-5"       // expandido
            : "px-2.5 py-2.5",          // solo ícono
          // Hover
          "hover:bg-gray-900 hover:text-white hover:border-gray-900",
          "hover:shadow-xl hover:shadow-black/20",
          // Activo
          "active:scale-95"
        )}
        aria-label={`Volver a ${label}`}
      >
        {/* Ícono con rotación en hover */}
        <ArrowLeft
          className={cn(
            "h-4 w-4 flex-shrink-0",
            "transition-transform duration-200",
            "group-hover:-translate-x-0.5"
          )}
        />
 
        {/* Label — aparece solo cuando hay scroll */}
        <span
          className={cn(
            "text-sm font-medium whitespace-nowrap",
            "transition-all duration-300 ease-out overflow-hidden",
            scrolled
              ? "max-w-[120px] opacity-100"
              : "max-w-0 opacity-0"
          )}
        >
          {label}
        </span>
      </Link>
    </div>
  );
}