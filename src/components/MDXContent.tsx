"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function MDXContent({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // 语法高亮 + 语言标签
  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);

      // 添加语言标签
      const pre = block.parentElement;
      if (!pre || pre.querySelector(".lang-label")) return;
      const lang = (block.className.match(/language-(\w+)/) || [])[1] || "";
      if (lang) {
        const label = document.createElement("span");
        label.className = "lang-label";
        label.textContent = lang;
        Object.assign(label.style, {
          position: "absolute",
          top: "8px",
          left: "12px",
          fontSize: "11px",
          fontWeight: "600",
          color: "rgba(255,255,255,0.35)",
          textTransform: "lowercase",
          letterSpacing: "0.5px",
          userSelect: "none",
        });
        pre.style.position = "relative";
        pre.appendChild(label);
      }
    });
  }, [content]);

  // 复制按钮
  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const addCopyButtons = () => {
      root.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return;

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "复制";
        Object.assign(btn.style, {
          position: "absolute",
          top: "8px",
          right: "8px",
          padding: "4px 10px",
          fontSize: "12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.08)",
          color: "#999",
          cursor: "pointer",
          opacity: "0",
          transition: "opacity 0.2s",
        });

        pre.style.position = "relative";
        pre.appendChild(btn);

        pre.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
        pre.addEventListener("mouseleave", () => { btn.style.opacity = "0"; });

        btn.addEventListener("click", async () => {
          const code = pre.querySelector("code")?.textContent || "";
          await navigator.clipboard.writeText(code);
          btn.textContent = "已复制!";
          btn.style.color = "#4ade80";
          setTimeout(() => {
            btn.textContent = "复制";
            btn.style.color = "#999";
          }, 2000);
        });
      });
    };

    addCopyButtons();
  }, [content]);

  return (
    <div
      ref={rootRef}
      className="mdx-content [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:border-b [&_h2]:border-[var(--border-light)] [&_h2]:pb-2 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:text-[var(--text-secondary)] [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-secondary)] [&_hr]:my-8 [&_hr]:border-[var(--border-light)] [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:border [&_pre]:border-[var(--border-light)] [&_pre]:my-4 [&_code]:text-sm [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:bg-gray-100 [&_p_code]:dark:bg-gray-800 [&_p_code]:text-rose-600 [&_p_code]:dark:text-rose-400 [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:rounded [&_li_code]:bg-gray-100 [&_li_code]:dark:bg-gray-800 [&_li_code]:text-rose-600 [&_li_code]:dark:text-rose-400 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-[var(--border-light)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-[var(--border-light)] [&_td]:border [&_td]:border-[var(--border-light)] [&_td]:px-3 [&_td]:py-2"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
