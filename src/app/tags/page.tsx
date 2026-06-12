"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface TagItem {
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  title: string;
  difficulty: string;
}

const diffColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function TagsPage() {
  const [tagMap, setTagMap] = useState<Record<string, TagItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data: unknown) => {
        const map = data as Record<string, TagItem[]>;
        setTagMap(map);
        const sorted = Object.entries(map).sort((a, b) => b[1].length - a[1].length);
        if (sorted.length > 0) setSelectedTag(sorted[0][0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-[var(--text-muted)]">加载中...</div>;
  }

  const sortedTags = Object.entries(tagMap).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Tag className="w-8 h-8 text-[var(--color-accent)]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">知识点标签</h1>
        </div>
        <p className="text-[var(--text-secondary)]">按标签浏览所有知识点，快速找到感兴趣的内容</p>
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sortedTags.map(([tag, items]) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              selectedTag === tag
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--color-accent)]"
            )}
          >
            {tag}
            <span className="ml-1.5 opacity-60">({items.length})</span>
          </button>
        ))}
      </div>

      {/* Selected tag items */}
      {selectedTag && (
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {selectedTag}
            <span className="text-sm font-normal text-[var(--text-muted)] ml-2">
              ({tagMap[selectedTag].length} 个知识点)
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tagMap[selectedTag].map((item, i) => (
              <Link
                key={i}
                href={`/stages/${item.stageId}/${item.topicId}/${item.slug}`}
                className="block p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] hover:border-[var(--color-accent)] hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.difficulty && (
                        <span className={clsx("text-xs font-medium px-1.5 py-0.5 rounded-full", diffColor[item.difficulty] || "")}>
                          {item.difficulty === "beginner" ? "入门" : item.difficulty === "intermediate" ? "核心" : "进阶"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
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
      )}
    </div>
  );
}
