"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { stages, type Stage } from "@/data/stages";
import { getStageProgress } from "@/lib/progress";
import { BookOpen, ChevronDown, ChevronRight, CheckCircle2, GraduationCap, Menu, X, Star } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string>(() => {
    const match = pathname.match(/\/stages\/([\w-]+)/);
    return match?.[1] || "";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stageProgress, setStageProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [interestedCount, setInterestedCount] = useState(0);

  // 延迟从 localStorage 读取进度，避免水合不匹配
  useEffect(() => {
    const progress: Record<string, { completed: number; total: number }> = {};
    for (const stage of stages) {
      progress[stage.id] = getStageProgress(stage.id, stage.topics.length);
    }
    setStageProgress(progress);
  }, []);

  useEffect(() => {
    const updateInterested = () => {
      try {
        const raw = localStorage.getItem("learning-interests");
        setInterestedCount(raw ? JSON.parse(raw).length : 0);
      } catch { setInterestedCount(0); }
    };
    updateInterested();
    window.addEventListener("storage", updateInterested);
    return () => window.removeEventListener("storage", updateInterested);
  }, []);

  useEffect(() => {
    fetch("/api/content/counts")
      .then((res) => res.json())
      .then((data) => setTopicCounts(data))
      .catch(() => {});
  }, []);

  const toggleStage = (id: string) => {
    setExpanded((prev) => (prev === id ? "" : id));
  };

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 border-b border-[var(--border-light)]">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[var(--color-accent)]" />
          <span className="font-bold text-lg text-[var(--text-primary)]">AI Agent 学习路线</span>
        </Link>
      </div>

      {/* Stages */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {stages.map((stage) => {
          const progress = stageProgress[stage.id] || { completed: 0, total: stage.topics.length };
          const isExpanded = expanded === stage.id;
          const isStageActive = pathname.startsWith(`/stages/${stage.id}`);

          return (
            <div key={stage.id} className="mb-1">
              <button
                onClick={() => toggleStage(stage.id)}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  isStageActive
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--border-light)]"
                )}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                <span className="flex-1 text-left font-medium">
                  {stage.number}. {stage.title}
                </span>
                {progress.total > 0 && (
                  <span className="text-xs text-[var(--text-muted)]">
                    {progress.completed}/{progress.total}
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="ml-3 mt-0.5 pl-3 border-l border-[var(--border-light)]">
                  {stage.topics.map((topic) => {
                    const topicPath = `/stages/${stage.id}/${topic.id}`;
                    const isTopicActive = pathname === topicPath || pathname.startsWith(topicPath + "/");

                    return (
                      <Link
                        key={topic.id}
                        href={topicPath}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                          isTopicActive
                            ? "text-[var(--color-accent)] font-medium"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <CheckCircle2 className={clsx(
                          "w-3.5 h-3.5 shrink-0",
                          isTopicActive ? "text-[var(--color-accent)]" : "text-[var(--text-muted)]"
                        )} />
                        <span className="flex-1 truncate">{topic.title}</span>
                        {topicCounts[`${stage.id}/${topic.id}`] !== undefined && (
                          <span className="text-xs text-[var(--text-muted)]">
                            {topicCounts[`${stage.id}/${topic.id}`]}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border-light)] space-y-1">
        <Link
          href="/tags"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          <BookOpen className="w-4 h-4" />
          按标签浏览
        </Link>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          <Star className={clsx("w-4 h-4", interestedCount > 0 && "text-amber-400")} />
          感兴趣{interestedCount > 0 ? ` (${interestedCount})` : ""}
        </Link>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          <BookOpen className="w-4 h-4" />
          学习路线总览
        </Link>
        <Link
          href="/graph"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          <GraduationCap className="w-4 h-4" />
          知识图谱
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-[var(--border-light)] bg-[var(--bg-sidebar)]">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-sidebar)] shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
