import { stages } from "@/data/stages";
import { getKnowledgeItems } from "@/lib/content";
import TopicClient from "./TopicClient";

export function generateStaticParams() {
  const params: Array<{ slug: string; topic: string }> = [];
  for (const stage of stages) {
    for (const topic of stage.topics) {
      params.push({ slug: stage.id, topic: topic.id });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic } = await params;
  const stage = stages.find((s) => s.id === slug);
  const topicMeta = stage?.topics.find((t) => t.id === topic);

  let items: Awaited<ReturnType<typeof getKnowledgeItems>> = [];
  try {
    items = await getKnowledgeItems(slug, topic);
  } catch (e) {
    console.error("Failed to load knowledge items:", e);
  }

  return (
    <TopicClient
      items={items}
      stageTitle={stage?.title ?? ""}
      stageId={slug}
      topicTitle={topicMeta?.title ?? topic}
      topicId={topic}
    />
  );
}
