"use client";

import { useTheme } from "@/lib/theme";
import SearchDialog from "./SearchDialog";
import Link from "next/link";
import { Moon, Sun, Tag } from "lucide-react";

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-sm">
      <Link
        href="/tags"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-muted)] border border-[var(--border-light)] rounded-lg hover:border-[var(--color-accent)] transition-colors"
      >
        <Tag className="w-4 h-4" />
        标签
      </Link>
      <SearchDialog />
      <button
        onClick={toggle}
        className="p-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--border-light)] transition-colors"
        title={theme === "light" ? "切换暗色模式" : "切换亮色模式"}
      >
        {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    </header>
  );
}
