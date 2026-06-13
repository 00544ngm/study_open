"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { stages } from "@/data/stages";
import type { KnowledgeItem } from "@/lib/content";
import { isCompleted, toggleTopic } from "@/lib/progress";
import MDXContent from "@/components/MDXContent";
import RelatedContent from "@/components/RelatedContent";
import TableOfContents from "@/components/TableOfContents";
import LearningPath from "@/components/LearningPath";
import { Clock, CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

async function loadItems(stageId: string, topicId: string): Promise<KnowledgeItem[]> {
  const res = await fetch(`/api/content?stage=${stageId}&topic=${topicId}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.items || [];
}

export default function KnowledgePage({
  params,
}: {
  params: Promise<{ slug: string; topic: string; itemSlug: string }>;
}) {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stageSlug, setStageSlug] = useState("");
  const [stageTitle, setStageTitle] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    params.then(async ({ slug, topic, itemSlug }) => {
      const s = stages.find((st) => st.id === slug);
      if (!s) return;
      setStageSlug(slug);
      setStageTitle(s.title);
      setTopicSlug(topic);
      const t = s.topics.find((tp) => tp.id === topic);
      if (!t) return;
      setTopicTitle(t.title);

      const loadedItems = await loadItems(slug, topic);
      setItems(loadedItems);

      const idx = loadedItems.findIndex((item) => item.slug === itemSlug);
      if (idx >= 0) {
        setCurrentIdx(idx);
        setCompleted(isCompleted(`${slug}/${topic}/${itemSlug}`));
      }
      setLoaded(true);
    });
  }, [params]);

  if (!loaded) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-[var(--text-muted, #94a3b8)]">加载中...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-[var(--text-muted, #94a3b8)] mb-4">该知识点暂未添加内容</p>
        <Link href="/" className="text-[var(--color-accent, #3b82f6)] hover:underline">返回首页</Link>
      </div>
    );
  }

  const currentSlug = items[currentIdx]?.slug;

  const handleToggle = () => {
    if (!currentSlug) return;
    toggleTopic(`${stageTitle}/${topicTitle}/${currentSlug}`);
    setCompleted(!completed);
  };

  const prevItem = currentIdx > 0 ? items[currentIdx - 1] : null;
  const nextItem = currentIdx < items.length - 1 ? items[currentIdx + 1] : null;

  const item = items[currentIdx];
  const diffLabel = item?.difficulty === "beginner" ? "入门" : item?.difficulty === "intermediate" ? "核心" : "进阶";
  const diffColor = item?.difficulty === "beginner" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : item?.difficulty === "intermediate" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted, #94a3b8)] mb-6">
        <Link href="/" className="hover:text-[var(--text-secondary, #475569)]">首页</Link>
        <span>/</span>
        <Link href={`/stages/${stageSlug}`} className="hover:text-[var(--text-secondary, #475569)]">{stageTitle}</Link>
        <span>/</span>
        <Link href={`/stages/${stageSlug}/${topicSlug}`} className="hover:text-[var(--text-secondary, #475569)]">{topicTitle}</Link>
        <span>/</span>
        <span className="text-[var(--text-primary, #0f172a)] truncate">{item?.title}</span>
      </div>

      {/* Nav bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted, #94a3b8)]">
            {currentIdx + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", diffColor)}>{diffLabel}</span>
          {item?.estimatedTime && (
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted, #94a3b8)]">
              <Clock className="w-3 h-3" />
              {item.estimatedTime}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary, #0f172a)]">{item?.title}</h1>
      </div>

      {/* Content with TOC */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {item && <MDXContent content={item.content} />}

          {/* Progress */}
          <div className="mt-8 flex justify-center">
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
          </div>

          {/* Learning path */}
          {item && (
            <LearningPath currentStage={stageSlug} currentTopic={topicSlug} />
          )}

          {/* Prev/Next */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--border-light, #e2e8f0)] pt-6">
            {prevItem ? (
              <Link
                href={`/stages/${stageSlug}/${topicSlug}/${prevItem.slug}`}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary, #475569)] hover:text-[var(--color-accent, #3b82f6)]"
              >
                <ChevronLeft className="w-4 h-4" />
                {prevItem.title}
              </Link>
            ) : <div />}
            {nextItem ? (
              <Link
                href={`/stages/${stageSlug}/${topicSlug}/${nextItem.slug}`}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary, #475569)] hover:text-[var(--color-accent, #3b82f6)]"
              >
                {nextItem.title}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div />}
          </div>

          {/* Related content */}
          {item && (
            <RelatedContent
              tags={item.tags}
              currentStage={stageTitle}
              currentTopic={topicTitle}
              currentSlug={item.slug}
            />
          )}
        </div>
        <TableOfContents />
      </div>
    </div>
  );
}
