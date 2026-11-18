import { notFound } from "next/navigation";
import { catalogs, pagePath, siteOrigin, type Locale } from "@/lib/seo";
import { Stage as RussianDemo } from "@/components/catalog/preview";
import { Stage as EnglishDemo } from "@/generated/en/components/catalog/preview";
import "@/components/catalog/catalog.css";

export function ComponentPage({ lang, slug }: { lang: Locale; slug: string }) {
  const en = lang === "en";
  const item = catalogs[lang].find((entry) => entry.slug === slug);
  if (!item) notFound();
  const alternate = en ? "ru" : "en";
  const home = pagePath(lang);
  const category = en ? "Catalog" : "Каталог";
  const registryPath = (en ? "/r/" : "/r/ru/") + item.slug + ".json";
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: category, item: siteOrigin + home },
      { "@type": "ListItem", position: 2, name: item.title, item: siteOrigin + pagePath(lang, slug) },
    ],
  };
  const Demo = en ? EnglishDemo : RussianDemo;
  return (
    <main className="mx-auto grid max-w-2xl gap-6 px-5 py-9 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <nav className="flex items-center justify-between border-b pb-4 text-sm" aria-label={en ? "Navigation" : "Навигация"}>
        <a className="font-semibold" href={home}>Takt / {category}</a>
        <a href={pagePath(alternate, slug)} hrefLang={alternate} lang={alternate}>{en ? "Русский" : "English"}</a>
      </nav>
      <header>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.category}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-3 text-muted-foreground">{item.description}</p>
      </header>
      <section aria-label={en ? "Interactive example" : "Интерактивный пример"}>
        <Demo entry={item} />
        <p className="mt-2 text-sm text-muted-foreground">{item.gesture}</p>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">{en ? "Install with shadcn" : "Установка через shadcn"}</h2>
        <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs"><code>{`bunx shadcn@latest add ${siteOrigin}${registryPath}`}</code></pre>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">{en ? "Usage" : "Использование"}</h2>
        <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs"><code>{`import { ${item.symbol} } from "@/components/ui/${item.slug}";\n\n${item.usage}`}</code></pre>
      </section>
      <footer className="flex flex-wrap gap-5 text-sm underline underline-offset-4">
        <a href={registryPath}>{en ? "Component source" : "Исходный код"}</a>
        <a href="/llms.txt">{en ? "Agent instructions" : "Инструкция для агента"}</a>
      </footer>
    </main>
  );
}
