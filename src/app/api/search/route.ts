import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { stages } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const q = query.toLowerCase();
  const results: Array<{
    stageId: string;
    stageTitle: string;
    topicId: string;
    topicTitle: string;
    slug: string;
    title: string;
    difficulty: string;
    estimatedTime: string;
    snippet: string;
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
          const { data, content } = matter(raw);
          const title: string = data.title || file;

          const cleanContent = content.replace(/[#*`\[\]]/g, "");

          if (
            title.toLowerCase().includes(q) ||
            cleanContent.toLowerCase().includes(q)
          ) {
            // 生成摘要：匹配关键词前后文字
            const matchIdx = cleanContent.toLowerCase().indexOf(q);
            let snippet = "";
            if (matchIdx >= 0) {
              const start = Math.max(0, matchIdx - 30);
              const end = Math.min(cleanContent.length, matchIdx + q.length + 60);
              snippet = (start > 0 ? "..." : "") +
                cleanContent.slice(start, end).trim() +
                (end < cleanContent.length ? "..." : "");
            } else {
              snippet = cleanContent.slice(0, 100).trim() + "...";
            }

            results.push({
              stageId: stage.id,
              stageTitle: stage.title,
              topicId: topic.id,
              topicTitle: topic.title,
              slug: file.replace(/^\d+-/, "").replace(".mdx", ""),
              title,
              difficulty: data.difficulty || "beginner",
              estimatedTime: data.estimated_time || "",
              snippet,
            });
          }
        } catch {
          // skip problematic files
        }
      }
    }
  }

  return NextResponse.json(results.slice(0, 20));
}
