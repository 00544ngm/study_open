"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import PythonRunner from "./PythonRunner";

export default function MDXContent({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // 语法高亮
  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  // 复制按钮 + Python 运行按钮
  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    root.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      const lang = (code?.className.match(/language-(\w+)/) || [])[1] || "";
      const isPython = ["python", "py"].includes(lang);

      // ── 语言标签 ──
      if (lang && !pre.querySelector(".lang-label")) {
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

      // ── 运行按钮 (仅 Python) ──
      if (isPython && !pre.querySelector(".run-btn")) {
        const btn = document.createElement("button");
        btn.className = "run-btn";
        btn.textContent = "▶ 运行";
        Object.assign(btn.style, {
          position: "absolute",
          top: "8px",
          right: "64px",
          padding: "4px 10px",
          fontSize: "12px",
          borderRadius: "6px",
          border: "1px solid rgba(35,134,54,0.3)",
          background: "rgba(35,134,54,0.15)",
          color: "#4ade80",
          cursor: "pointer",
          opacity: "0",
          transition: "opacity 0.2s",
        });

        pre.style.position = "relative";
        pre.appendChild(btn);

        pre.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
        pre.addEventListener("mouseleave", () => {
          btn.style.opacity = "0";
        });

        btn.addEventListener("click", async () => {
          const codeText = code?.textContent || "";

          // Check if runner panel already exists
          const existing = pre.nextElementSibling;
          if (existing && existing.classList.contains("python-runner-wrap")) {
            existing.remove();
            btn.textContent = "▶ 运行";
            return;
          }

          btn.textContent = "运行中...";

          // Create container and mount PythonRunner
          const container = document.createElement("div");
          container.className = "python-runner-wrap";
          pre.parentNode?.insertBefore(container, pre.nextSibling);

          const rootEl = createRoot(container);
          rootEl.render(
            <PythonRunner code={codeText} language="python" />
          );

          btn.textContent = "✕ 关闭";
        });
      }

      // ── 复制按钮 (已有逻辑) ──
      if (pre.querySelector(".copy-btn")) return;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "复制";
      Object.assign(copyBtn.style, {
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

      pre.appendChild(copyBtn);

      pre.addEventListener("mouseenter", () => { copyBtn.style.opacity = "1"; });
      pre.addEventListener("mouseleave", () => { copyBtn.style.opacity = "0"; });

      copyBtn.addEventListener("click", async () => {
        const txt = pre.querySelector("code")?.textContent || "";
        await navigator.clipboard.writeText(txt);
        copyBtn.textContent = "已复制!";
        copyBtn.style.color = "#4ade80";
        setTimeout(() => {
          copyBtn.textContent = "复制";
          copyBtn.style.color = "#999";
        }, 2000);
      });
    });
  }, [content]);

  return (
    <div
      ref={rootRef}
      className="mdx-content [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:border-b [&_h2]:border-[var(--border-light)] [&_h2]:pb-2 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:text-[var(--text-secondary)] [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-secondary)] [&_hr]:my-8 [&_hr]:border-[var(--border-light)] [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:border [&_pre]:border-[var(--border-light)] [&_pre]:my-4 [&_code]:text-sm [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:bg-gray-100 [&_p_code]:dark:bg-gray-800 [&_p_code]:text-rose-600 [&_p_code]:dark:text-rose-400 [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:rounded [&_li_code]:bg-gray-100 [&_li_code]:dark:bg-gray-800 [&_li_code]:text-rose-600 [&_li_code]:dark:text-rose-400 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-[var(--border-light)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-[var(--border-light)] [&_td]:border [&_td]:border-[var(--border-light)] [&_td]:px-3 [&_td]:py-2"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
