export type Article = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  tag: string;
};

// Тестовый набор — 3 статьи с блога toque-store.ru/blog, ссылки открываются
// во внешнем окне. Полноценный список появится, когда решим держать контент
// прямо в приложении или тянуть его через RSS/CMS-интеграцию.
export const articles: Article[] = [
  {
    id: "rasshirennye-pory-na-lice",
    title: "Расширенные поры на лице",
    excerpt:
      "Поры нельзя закрыть полностью, но регулярный домашний уход делает их заметно менее выраженными.",
    url: "https://toque-store.ru/blog/rasshirennye-pory-na-lice",
    tag: "Уход",
  },
  {
    id: "limfodrenozhnyj-massazh-lica",
    title: "Лимфодренажный массаж лица",
    excerpt:
      "Простая техника без специальных инструментов — заметный эффект по снижению отёчности уже после одного применения.",
    url: "https://toque-store.ru/blog/limfodrenozhnyj-massazh-lica",
    tag: "Техники",
  },
  {
    id: "mikrotoki-dlya-lica-effekt",
    title: "Микротоки для лица: эффект",
    excerpt:
      "Честный разбор технологии: что даёт разовая процедура, а что — только регулярный курс.",
    url: "https://toque-store.ru/blog/mikrotoki-dlya-lica-effekt",
    tag: "Технологии",
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
