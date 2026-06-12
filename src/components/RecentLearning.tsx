"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecent } from "@/lib/progress";
import { Clock, ArrowRight } from "lucide-react";
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

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return `${Math.floor(days / 30)} 个月前`;
}

export default function RecentLearning() {
  const [items, setItems] = useState<Array<ResolvedItem & { time: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recent = getRecent();
    if (recent.length === 0) {
      setLoading(false);
      return;
    }

    const keys = recent.map((r) => r.key);
    fetch("/api/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    })
      .then((res) => res.json())
      .then((data: ResolvedItem[]) => {
        const merged = recent
          .map((r) => {
            const resolved = data.find((d) => d.key === r.key);
            return resolved ? { ...resolved, time: r.time } : null;
          })
          .filter(Boolean) as Array<ResolvedItem & { time: number }>;
        setItems(merged);
      })
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
        <Clock className="w-5 h-5 text-[var(--color-accent)]" />
        最近学习
      </h2>
      <div className="space-y-2">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.key}
            href={`/stages/${item.stageId}/${item.topicId}/${item.slug}`}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-[var(--color-accent)] transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={clsx("text-xs font-medium px-1.5 py-0.5 rounded shrink-0", diffStyle(item.difficulty))}>
                {diffLabel(item.difficulty)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {item.stageTitle} / {item.topicTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[var(--text-muted)]">{timeAgo(item.time)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
