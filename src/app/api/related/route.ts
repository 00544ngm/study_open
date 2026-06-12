import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { stages } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export async function GET(request: NextRequest) {
  const tagsParam = request.nextUrl.searchParams.get("tags") || "";
  const currentSlug = request.nextUrl.searchParams.get("current") || "";
  const currentStage = request.nextUrl.searchParams.get("stage") || "";
  const currentTopic = request.nextUrl.searchParams.get("topic") || "";

  if (!tagsParam) return NextResponse.json([]);

  const tags = tagsParam.split(",").map((t) => t.trim().toLowerCase());

  const related: Array<{
    stageId: string;
    stageTitle: string;
    topicId: string;
    topicTitle: string;
    slug: string;
    title: string;
    difficulty: string;
  }> = [];

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
          const fileTags: string[] = (data.tags || []).map((t: string) => t.toLowerCase());
          const slug = file.replace(/^\d+-/, "").replace(".mdx", "");

          // 跳过当前文章
          if (stage.id === currentStage && topic.id === currentTopic && slug === currentSlug) continue;

          // 只要有 tag 匹配就算相关
          const matches = tags.some((t) => fileTags.includes(t));
          if (matches) {
            related.push({
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

  // 去重并限制数量
  const seen = new Set<string>();
  const deduped = related.filter((r) => {
    const key = `${r.stageId}/${r.topicId}/${r.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json(deduped.slice(0, 6));
}
