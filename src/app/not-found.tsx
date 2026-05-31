import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-muted-foreground mb-8">
        El contenido que busca no existe o fue retirado.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
