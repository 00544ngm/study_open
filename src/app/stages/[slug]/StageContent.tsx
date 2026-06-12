"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stages, type Stage } from "@/data/stages";
import { getStageProgress } from "@/lib/progress";
import ExportProgress from "@/components/ExportProgress";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import clsx from "clsx";

function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.id === slug);
}

export default function StageContent({ slug: slugPromise }: { slug: Promise<string> }) {
  const [stage, setStage] = useState<Stage | null>(null);
  const pathname = usePathname();
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/content/counts")
      .then((res) => res.json())
      .then((data) => setTopicCounts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    slugPromise.then((s) => {
      setSlug(s);
      const found = getStage(s);
      if (found) setStage(found);
    });
  }, [slugPromise]);

  if (!stage) return null;

  const progress = mounted ? getStageProgress(stage.id, stage.topics.length) : { completed: 0, total: stage.topics.length };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-6">
        <ArrowLeft className="w-4 h-4" />
        返回总览
      </Link>

      {/* Stage header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--border-light)] text-[var(--text-secondary)]">
              阶段 {stage.number}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{stage.subtitle}</span>
          </div>
          {mounted && <ExportProgress />}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          {stage.title}
        </h1>
        <p className="text-[var(--text-secondary)] mb-4">{stage.description}</p>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {stage.topics.length} 个模块
          </span>
          {mounted && (
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              已完成 {progress.completed}/{progress.total}
            </span>
          )}
        </div>
        <ProgressBar completed={progress.completed} total={progress.total} />
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {stage.topics.map((topic) => {
          const topicPath = `/stages/${stage.id}/${topic.id}`;
          const isActive = pathname === topicPath;

          return (
            <Link
              key={topic.id}
              href={topicPath}
              className={clsx(
                "block p-4 rounded-xl border transition-all",
                isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                  : "border-[var(--border-light)] bg-[var(--bg-card)] hover:border-[var(--color-accent)] hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    isActive
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--border-light)] text-[var(--text-secondary)]"
                  )}>
                    {topic.order}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{topic.title}</h3>
                    {mounted && topicCounts[`${stage.id}/${topic.id}`] !== undefined && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {topicCounts[`${stage.id}/${topic.id}`]} 个知识点
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
