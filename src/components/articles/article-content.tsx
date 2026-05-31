import { sanitizeHtml } from "@/lib/sanitize";

type ArticleContentProps = {
  html: string;
};

export function ArticleContent({ html }: ArticleContentProps) {
  const safe = sanitizeHtml(html);
  return (
    <div
      className="prose-article"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
