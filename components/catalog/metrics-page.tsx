import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { LatencyChart } from "@/components/motion/latency-chart";
import { ConversionFunnel } from "@/components/motion/conversion-funnel";
import { CohortRetention } from "@/components/motion/cohort-retention";
import { AccentPicker } from "./accent-picker";
import { MessengerTheme } from "./messenger-theme";

export function MetricsPage({ lang }: { lang: "en" | "ru" }) {
  const prefix = lang === "ru" ? "/ru" : "";
  const panels = [
    {
      slug: "latency-chart",
      name: "Latency Chart",
      widget: <LatencyChart className="sm:[&_[data-slot=chart]]:h-48" />,
    },
    {
      slug: "conversion-funnel",
      name: "Conversion Funnel",
      widget: <ConversionFunnel />,
    },
    {
      slug: "cohort-retention",
      name: "Cohort Retention",
      widget: <CohortRetention />,
    },
  ];
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 text-foreground sm:px-8">
      <header className="flex h-16 items-center justify-between border-b">
        <Link
          href={prefix || "/"}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          Каталог Takt
        </Link>
        <div className="flex items-center gap-2">
          <AccentPicker />
          <MessengerTheme />
          <Link
            className="grid size-9 place-items-center rounded-lg border text-xs font-semibold"
            href={lang === "ru" ? "/metrics" : "/ru/metrics"}
            hrefLang={lang === "ru" ? "en" : "ru"}
          >
            {lang === "ru" ? "EN" : "RU"}
          </Link>
        </div>
      </header>
      <div className="pt-9 pb-6 sm:pt-12">
        <h1 className="text-4xl font-semibold tracking-[-.055em] sm:text-6xl">
          Метрики платформы
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Демо на данных учебного курса. Исследуйте замеры, переходы между
          этапами и возврат студентов по неделям.
        </p>
      </div>
      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        {panels.map(({ slug, name, widget }, index) => (
          <section
            key={slug}
            className={index === 0 ? "min-w-0 sm:col-span-2" : "min-w-0"}
          >
            {widget}
            <Link
              href={prefix + "/components/" + slug}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1 text-xs font-medium text-muted-foreground hover:text-primary"
            >
              <Code2 size={14} />
              {name} · <span>Код и установка</span>
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
