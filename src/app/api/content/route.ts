import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeItems } from "@/lib/content";

export async function GET(request: NextRequest) {
  const stage = request.nextUrl.searchParams.get("stage");
  const topic = request.nextUrl.searchParams.get("topic");

  if (!stage || !topic) {
    return NextResponse.json({ error: "Missing stage or topic" }, { status: 400 });
  }

  try {
    const items = await getKnowledgeItems(stage, topic);
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: String(e), items: [] }, { status: 200 });
  }
}
