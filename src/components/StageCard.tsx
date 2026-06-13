"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { getStageProgress } from "@/lib/progress";
import type { Stage } from "@/data/stages";
import clsx from "clsx";

export default function StageCard({ stage }: { stage: Stage }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const progress = mounted ? getStageProgress(stage.id, stage.topics.length) : { completed: 0, total: stage.topics.length };

  return (
    <Link
      href={`/stages/${stage.id}`}
      className="group block rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className={clsx("h-2 bg-gradient-to-r", stage.color)} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--border-light)] text-[var(--text-secondary)]">
                阶段 {stage.number}
              </span>
              <span className="text-xs text-[var(--text-muted)]">{stage.subtitle}</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {stage.title}
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
          {stage.description}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{stage.topics.length} 个知识点</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {stage.topics.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    i < progress.completed ? "bg-[var(--color-success)]" : "bg-[var(--border-light)]"
                  )}
                />
              ))}
            </div>
            <span suppressHydrationWarning>{progress.completed}/{progress.total}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
