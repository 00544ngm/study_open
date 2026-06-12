"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface RelatedItem {
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  title: string;
  difficulty: string;
}

interface Props {
  tags: string[];
  currentStage: string;
  currentTopic: string;
  currentSlug: string;
}

const diffColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function RelatedContent({ tags, currentStage, currentTopic, currentSlug }: Props) {
  const [items, setItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tags.length) {
      setLoading(false);
      return;
    }
    fetch(
      `/api/related?tags=${encodeURIComponent(tags.join(","))}` +
        `&current=${currentSlug}&stage=${currentStage}&topic=${currentTopic}`
    )
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tags, currentStage, currentTopic, currentSlug]);

  if (loading || items.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-[var(--border-light)]">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        相关知识点
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <Link
            key={i}
            href={`/stages/${item.stageId}/${item.topicId}/${item.slug}`}
            className="block p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-[var(--color-accent)] hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.difficulty && (
                    <span className={clsx("text-xs font-medium px-1.5 py-0.5 rounded-full", diffColor[item.difficulty])}>
                      {item.difficulty === "beginner" ? "入门" : item.difficulty === "intermediate" ? "核心" : "进阶"}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {item.stageTitle} / {item.topicTitle}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
