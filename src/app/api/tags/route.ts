import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { stages } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export async function GET() {
  const tagMap: Record<string, Array<{
    stageId: string;
    stageTitle: string;
    topicId: string;
    topicTitle: string;
    slug: string;
    title: string;
    difficulty: string;
  }>> = {};

  for (const stage of stages) {
    for (const topic of stage.topics) {
      const topicDir = path.join(contentDir, stage.id, topic.id);
      if (!fs.existsSync(topicDir)) continue;

      const files = fs.readdirSync(topicDir).filter(
        (f) => f.endsWith(".mdx") && !f.startsWith("_")
      );

      for (const file of files) {
        try {
          const raw = fs.readFileSync(path.join(topicDir, file), "utf-8");
          const { data } = matter(raw);
          const tags: string[] = data.tags || [];
          const slug = file.replace(/^\d+-/, "").replace(".mdx", "");

          for (const tag of tags) {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push({
              stageId: stage.id,
              stageTitle: stage.title,
              topicId: topic.id,
              topicTitle: topic.title,
              slug,
              title: data.title || file,
              difficulty: data.difficulty || "beginner",
            });
          }
        } catch {
          // skip
        }
      }
    }
  }

  return NextResponse.json(tagMap);
}
