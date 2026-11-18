import { notFound } from "next/navigation";
import { ComponentPage } from "@/components/component-page";
import { catalogs, pageMetadata } from "@/lib/seo";

const lang = "ru";
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogs[lang].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = catalogs[lang].find((entry) => entry.slug === slug);
  if (!item) notFound();
  return pageMetadata(lang, item);
}

export default async function Page({ params }: Props) {
  return <ComponentPage lang={lang} slug={(await params).slug} />;
}
