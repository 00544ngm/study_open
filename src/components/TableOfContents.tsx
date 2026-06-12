"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import clsx from "clsx";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 从文章内容中提取 h2, h3
    const article = document.querySelector(".mdx-content");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const toc: TocItem[] = [];

    headings.forEach((h) => {
      const text = h.textContent || "";
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w一-鿿-]/g, "");
      h.id = id;
      toc.push({
        id,
        text,
        level: h.tagName === "H2" ? 2 : 3,
      });
    });

    setItems(toc);
  }, []);

  // 高亮当前可见的标题
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-3">
          <ListTree className="w-4 h-4" />
          目录
        </div>
        <ul className="space-y-1 text-sm border-l border-[var(--border-light)]">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={clsx(
                  "block py-1 border-l-2 transition-all",
                  item.level === 3 ? "pl-6" : "pl-3",
                  activeId === item.id
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] font-medium"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
