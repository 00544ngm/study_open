import KnowledgePage from "./KnowledgePage";

export function generateStaticParams() {
  // We'll generate these dynamically; for now return a sample
  const params: Array<{ slug: string; topic: string; itemSlug: string }> = [];
  return params;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string; topic: string; itemSlug: string }>;
}) {
  return <KnowledgePage params={params} />;
}
