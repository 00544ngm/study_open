"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import TableOfContents from "@/components/TableOfContents";
import LearningPath from "@/components/LearningPath";
import { isCompleted, toggleTopic, isInterested, toggleInterest } from "@/lib/progress";
import type { KnowledgeItem } from "@/lib/content";
import { Clock, CheckCircle2, Circle, ChevronLeft, ChevronRight, Filter, Star } from "lucide-react";
import clsx from "clsx";

export default function TopicClient({
  items,
  stageTitle,
  stageId,
  topicTitle,
  topicId,
}: {
  items: KnowledgeItem[];
  stageTitle: string;
  stageId: string;
  topicTitle: string;
  topicId: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const topRef = useRef<HTMLDivElement>(null);

  // 按难度筛选
  const filteredItems = difficultyFilter === "all"
    ? items
    : items.filter((item) => item.difficulty === difficultyFilter);

  const effectiveIdx = filteredItems.length > 0
    ? Math.min(currentIdx, filteredItems.length - 1)
    : 0;
  const item = filteredItems[effectiveIdx] || null;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIdx]);

  const completed = item ? isCompleted(`${stageId}/${topicId}/${item.slug}`) : false;
  const interested = item ? isInterested(`${stageId}/${topicId}/${item.slug}`) : false;

  const handleToggle = () => {
    if (!item) return;
    toggleTopic(`${stageId}/${topicId}/${item.slug}`);
  };

  const handleInterest = () => {
    if (!item) return;
    toggleInterest(`${stageId}/${topicId}/${item.slug}`);
  };

  const prevItem = effectiveIdx > 0 ? filteredItems[effectiveIdx - 1] : null;
  const nextItem = effectiveIdx < filteredItems.length - 1 ? filteredItems[effectiveIdx + 1] : null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-[var(--text-muted, #94a3b8)] mb-4">该模块暂未添加内容</p>
        <Link href={`/stages/${stageId}`} className="text-[var(--color-accent, #3b82f6)] hover:underline">
          返回 {stageTitle}
        </Link>
      </div>
    );
  }

  const diffLabel = item?.difficulty === "beginner" ? "入门" : item?.difficulty === "intermediate" ? "核心" : "进阶";
  const diffColor = item?.difficulty === "beginner"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : item?.difficulty === "intermediate"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

  const difficultyOptions = [
    { value: "all", label: "全部", count: items.length },
    { value: "beginner", label: "入门", count: items.filter((i) => i.difficulty === "beginner").length },
    { value: "intermediate", label: "核心", count: items.filter((i) => i.difficulty === "intermediate").length },
    { value: "advanced", label: "进阶", count: items.filter((i) => i.difficulty === "advanced").length },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={topRef} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted, #94a3b8)] mb-6">
        <Link href="/" className="hover:text-[var(--text-secondary, #475569)]">首页</Link>
        <span>/</span>
        <Link href={`/stages/${stageId}`} className="hover:text-[var(--text-secondary, #475569)]">{stageTitle}</Link>
        <span>/</span>
        <span className="text-[var(--text-primary, #0f172a)]">{topicTitle}</span>
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-[var(--text-muted, #94a3b8)]" />
        {difficultyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setDifficultyFilter(opt.value); setCurrentIdx(0); }}
            className={clsx(
              "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              difficultyFilter === opt.value
                ? "bg-[var(--color-accent, #3b82f6)] text-white border-[var(--color-accent, #3b82f6)]"
                : "border-[var(--border-light, #e2e8f0)] text-[var(--text-muted, #94a3b8)] hover:border-[var(--color-accent, #3b82f6)]"
            )}
          >
            {opt.label}
            <span className="ml-1 opacity-60">({opt.count})</span>
          </button>
        ))}
      </div>

      {/* Navigation dots */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted, #94a3b8)]">
              {effectiveIdx + 1} / {filteredItems.length}
            </span>
            <div className="flex gap-1">
              {filteredItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={clsx(
                    "w-2 h-2 rounded-full transition-colors",
                    i === effectiveIdx ? "bg-[var(--color-accent, #3b82f6)]" : "bg-[var(--border-light, #e2e8f0)] hover:bg-[var(--text-muted, #94a3b8)]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article header */}
      {item && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", diffColor)}>
              {diffLabel}
            </span>
            {item.estimatedTime && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted, #94a3b8)]">
                <Clock className="w-3 h-3" />
                {item.estimatedTime}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary, #0f172a)]">
            {item.title}
          </h1>
        </div>
      )}

      {/* Content with TOC */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {item && <MDXContent content={item.content} />}

          {/* Progress toggle */}
          {item && (
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={handleToggle}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all",
                  completed
                    ? "border-[var(--color-success, #10b981)] text-[var(--color-success, #10b981)] bg-[var(--color-success, #10b981)]/5"
                    : "border-[var(--border-light, #e2e8f0)] text-[var(--text-muted, #94a3b8)] hover:border-[var(--color-accent, #3b82f6)]"
                )}
              >
                {completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {completed ? "已学完" : "标记为已学"}
              </button>
              <button
                onClick={handleInterest}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all",
                  interested
                    ? "border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-[var(--border-light, #e2e8f0)] text-[var(--text-muted, #94a3b8)] hover:border-amber-400"
                )}
              >
                <Star className={clsx("w-4 h-4", interested && "fill-amber-400")} />
                {interested ? "已感兴趣" : "感兴趣"}
              </button>
            </div>
          )}

          {/* Learning path */}
          {item && (
            <LearningPath currentStage={stageId} currentTopic={topicId} />
          )}

          {/* Prev / Next */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--border-light, #e2e8f0)] pt-6">
            {prevItem ? (
              <button
                onClick={() => setCurrentIdx(effectiveIdx - 1)}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary, #475569)] hover:text-[var(--color-accent, #3b82f6)]"
              >
                <ChevronLeft className="w-4 h-4" />
                {prevItem.title}
              </button>
            ) : <div />}
            {nextItem ? (
              <button
                onClick={() => setCurrentIdx(effectiveIdx + 1)}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary, #475569)] hover:text-[var(--color-accent, #3b82f6)]"
              >
                {nextItem.title}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>

          {/* Related content */}
          {item && (
            <RelatedContent
              tags={item.tags}
              currentStage={stageId}
              currentTopic={topicId}
              currentSlug={item.slug}
            />
          )}
        </div>
        <TableOfContents />
      </div>
    </div>
  );
}
