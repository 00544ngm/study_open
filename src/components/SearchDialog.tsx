"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, FileText, X, Clock } from "lucide-react";

interface SearchResult {
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  snippet: string;
}

const diffLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "核心",
  advanced: "进阶",
};

const diffColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Fetch search results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSelectedIdx(0);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then(setResults)
      .catch(() => {});
  }, [query]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      e.preventDefault();
      const r = results[selectedIdx];
      window.location.href = `/stages/${r.stageId}/${r.topicId}/${r.slug}`;
      setOpen(false);
      setQuery("");
    }
  };

  // Auto-scroll selected into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIdx] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--text-muted)] border border-[var(--border-light)] rounded-lg hover:border-[var(--color-accent)] transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">搜索知识点...</span>
        <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded bg-[var(--border-light)]">Ctrl+K</kbd>
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/50" />
          <div
            ref={dialogRef}
            className="relative w-full max-w-lg rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)]">
              <Search className="w-5 h-5 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索知识点..."
                className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto">
              {results.length === 0 && query.trim() ? (
                <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  没有找到相关结果
                </div>
              ) : (
                results.map((r, i) => (
                  <Link
                    key={i}
                    href={`/stages/${r.stageId}/${r.topicId}/${r.slug}`}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      i === selectedIdx
                        ? "bg-[var(--color-accent)]/10"
                        : "hover:bg-[var(--border-light)]"
                    }`}
                  >
                    <FileText className="w-4 h-4 mt-0.5 text-[var(--text-muted)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {r.title}
                        </span>
                        {r.difficulty && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0 ${diffColor[r.difficulty] || ""}`}>
                            {diffLabel[r.difficulty] || r.difficulty}
                          </span>
                        )}
                      </div>
                      {r.snippet && (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-1">
                          {r.snippet}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span>{r.stageTitle} / {r.topicTitle}</span>
                        {r.estimatedTime && (
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {r.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
