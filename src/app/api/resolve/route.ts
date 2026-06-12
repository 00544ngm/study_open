import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { stages } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export async function POST(request: NextRequest) {
  const { keys }: { keys: string[] } = await request.json();
  const results: Array<{
    key: string;
    stageId: string;
    stageTitle: string;
    topicId: string;
    topicTitle: string;
    slug: string;
    title: string;
    difficulty: string;
  }> = [];

  for (const key of keys) {
    const parts = key.split("/");
    if (parts.length < 3) continue;
    const [stageId, topicId, ...slugParts] = parts;
    const slug = slugParts.join("/");

    const stage = stages.find((s) => s.id === stageId);
    if (!stage) continue;
    const topic = stage.topics.find((t) => t.id === topicId);
    if (!topic) continue;

    const topicDir = path.join(contentDir, stageId, topicId);
    if (!fs.existsSync(topicDir)) continue;

    const files = fs.readdirSync(topicDir).filter(
      (f) => f.endsWith(".mdx") && !f.startsWith("_")
    );

    for (const file of files) {
      const fileSlug = file.replace(/^\d+-/, "").replace(".mdx", "");
      if (fileSlug === slug) {
        try {
          const raw = fs.readFileSync(path.join(topicDir, file), "utf-8");
          const { data } = matter(raw);
          results.push({
            key,
            stageId,
            stageTitle: stage.title,
            topicId,
            topicTitle: topic.title,
            slug,
            title: data.title || file,
            difficulty: data.difficulty || "beginner",
          });
        } catch {
          // skip
        }
        break;
      }
    }
  }

  return NextResponse.json(results);
}
