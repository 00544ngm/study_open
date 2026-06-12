"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInterested } from "@/lib/progress";
import { Star, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface ResolvedItem {
  key: string;
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  title: string;
  difficulty: string;
}

export default function InterestedSection() {
  const [items, setItems] = useState<ResolvedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keys = getInterested();
    if (keys.length === 0) {
      setLoading(false);
      return;
    }

    fetch("/api/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    })
      .then((res) => res.json())
      .then((data: ResolvedItem[]) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  const diffStyle = (d: string) =>
    d === "beginner"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : d === "intermediate"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

  const diffLabel = (d: string) =>
    d === "beginner" ? "入门" : d === "intermediate" ? "核心" : "进阶";

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        感兴趣 ({items.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.key}
            href={`/stages/${item.stageId}/${item.topicId}/${item.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-amber-400 transition-all text-sm group"
          >
            <span className={clsx("text-xs font-medium px-1 py-0.5 rounded", diffStyle(item.difficulty))}>
              {diffLabel(item.difficulty)}
            </span>
            <span className="text-[var(--text-primary)]">{item.title}</span>
            <span className="text-xs text-[var(--text-muted)]">{item.stageTitle}/{item.topicTitle}</span>
            <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-amber-400 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
