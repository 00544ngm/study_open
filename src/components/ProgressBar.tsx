"use client";

import clsx from "clsx";

export default function ProgressBar({
  completed,
  total,
  showLabel = true,
  size = "md",
}: {
  completed: number;
  total: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-sm text-[var(--text-muted)] shrink-0">
          完成 <strong className="text-[var(--text-primary)]">{pct}%</strong>
        </span>
      )}
      <div
        className={clsx(
          "flex-1 rounded-full bg-[var(--border-light)] overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-success)] transition-all duration-500",
            pct === 100 && "from-[var(--color-success)] to-[var(--color-success)]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
