import { TipoArticulo } from "@prisma/client";
import { ArticleCard } from "@/components/articles/article-card";
import { getPublishedArticles } from "@/lib/articles";

type CategoryPageProps = {
  tipo: TipoArticulo;
  title: string;
  description: string;
};

export async function CategoryPage({ tipo, title, description }: CategoryPageProps) {
  const articles = await getPublishedArticles({ tipo });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 border-b-2 border-ufro-red pb-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ufro-blue">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
      </header>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">No hay publicaciones en esta sección.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      )}
    </div>
  );
}
