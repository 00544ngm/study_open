import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { stages, type Stage } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export interface KnowledgeDoc {
  slug: string;
  title: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  tags: string[];
  content: string;
}

export interface KnowledgeItem {
  slug: string;
  title: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  tags: string[];
  content: string;
}

export function getKnowledgeDocs(stageId: string, topicId: string): KnowledgeDoc[] {
  const topicDir = path.join(contentDir, stageId, topicId);
  if (!fs.existsSync(topicDir)) return [];

  const files = fs.readdirSync(topicDir).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(topicDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/^\d+-/, "").replace(".mdx", ""),
        title: data.title || file,
        order: data.order || 99,
        difficulty: data.difficulty || "beginner",
        estimatedTime: data.estimated_time || "10min",
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export async function getKnowledgeItems(stageId: string, topicId: string): Promise<KnowledgeItem[]> {
  const docs = getKnowledgeDocs(stageId, topicId);
  return Promise.all(
    docs.map(async (doc) => ({
      ...doc,
      content: await marked.parse(doc.content),
    }))
  );
}

export function getTopicOverview(stageId: string, topicId: string): string | null {
  const filePath = path.join(contentDir, stageId, topicId, "_index.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getStageOverview(stageId: string): string | null {
  const filePath = path.join(contentDir, stageId, "_index.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.id === slug);
}

export function getAllStages(): Stage[] {
  return stages;
}

export async function getSearchableContent() {
  const results: Array<{
    stageId: string;
    stageTitle: string;
    topicId: string;
    topicTitle: string;
    slug: string;
    title: string;
    content: string;
  }> = [];

  for (const stage of stages) {
    for (const topic of stage.topics) {
      const docs = getKnowledgeDocs(stage.id, topic.id);
      for (const doc of docs) {
        results.push({
          stageId: stage.id,
          stageTitle: stage.title,
          topicId: topic.id,
          topicTitle: topic.title,
          slug: doc.slug,
          title: doc.title,
          content: doc.content.replace(/[#*`\[\]]/g, "").slice(0, 300),
        });
      }
    }
  }
  return results;
}
