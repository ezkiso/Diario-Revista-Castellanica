export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidar cada 5 minutos

import { ArticleCard } from "@/components/articles/article-card";
import { HeroArticle } from "@/components/articles/hero-article";
import { getPublishedArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getPublishedArticles();

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl text-muted-foreground">
          Aún no hay publicaciones. Vuelva pronto.
        </h2>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroArticle {...featured} />
      <section aria-labelledby="mas-noticias">
        <h2
          id="mas-noticias"
          className="font-serif text-xl font-bold border-b-2 border-ufro-red pb-2 mb-6"
        >
          Más publicaciones
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>
    </div>
  );
}
