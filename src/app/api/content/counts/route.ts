import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { stages } from "@/data/stages";

const contentDir = path.join(process.cwd(), "content");

export async function GET() {
  const counts: Record<string, number> = {};

  for (const stage of stages) {
    for (const topic of stage.topics) {
      const topicDir = path.join(contentDir, stage.id, topic.id);
      if (!fs.existsSync(topicDir)) {
        counts[`${stage.id}/${topic.id}`] = 0;
        continue;
      }
      const files = fs.readdirSync(topicDir).filter(
        (f) => f.endsWith(".mdx") && !f.startsWith("_")
      );
      counts[`${stage.id}/${topic.id}`] = files.length;
    }
  }

  return NextResponse.json(counts);
}
