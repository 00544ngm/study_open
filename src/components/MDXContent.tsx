"use client";

import { useEffect, useRef, useCallback } from "react";
import { createRoot, type Root } from "react-dom/client";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import PythonRunner from "./PythonRunner";

const RUNNER_ATTR = "data-py-runner";
const COPY_ATTR = "data-copy-btn";

function createStyles() {
  const baseBtn = (right: string): Partial<CSSStyleDeclaration> => ({
    position: "absolute",
    top: "8px",
    right,
    padding: "4px 10px",
    fontSize: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    opacity: "0",
    transition: "opacity 0.2s",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.08)",
    color: "#999",
  });

  return { baseBtn };
}

const styles = createStyles();

export default function MDXContent({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const runnerRoots = useRef(new Map<Element, Root>());

  const cleanupRunners = useCallback(() => {
    for (const [el, root] of runnerRoots.current) {
      root.unmount();
      el.remove();
    }
    runnerRoots.current.clear();
  }, []);

  // Syntax highlighting
  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  // Copy + run buttons
  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    root.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      const lang = (code?.className.match(/language-(\w+)/) || [])[1] || "";
      const isPython = ["python", "py"].includes(lang);

      pre.style.position = "relative";

      // Language label
      if (lang && !pre.querySelector("[data-lang-label]")) {
        const label = document.createElement("span");
        label.setAttribute("data-lang-label", "");
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
        pre.appendChild(label);
      }

      // Run button (Python only)
      if (isPython && !pre.querySelector(`[${RUNNER_ATTR}]`)) {
        const runBtn = document.createElement("button");
        runBtn.setAttribute(RUNNER_ATTR, "");
        runBtn.textContent = "▶ 运行";
        runBtn.setAttribute("aria-label", "运行此 Python 代码");
        Object.assign(runBtn.style, {
          ...styles.baseBtn("64px"),
          border: "1px solid rgba(35,134,54,0.3)",
          background: "rgba(35,134,54,0.15)",
          color: "#4ade80",
        });
        pre.appendChild(runBtn);

        pre.addEventListener("mouseenter", () => { runBtn.style.opacity = "1"; });
        pre.addEventListener("mouseleave", () => {
          if (runBtn.textContent !== "▶ 运行") return;
          runBtn.style.opacity = "0";
        });

        runBtn.addEventListener("click", () => {
          const codeText = code?.textContent || "";
          const existing = pre.nextElementSibling as HTMLElement | null;

          if (existing?.dataset.pyRunnerPanel) {
            const oldRoot = runnerRoots.current.get(existing);
            if (oldRoot) oldRoot.unmount();
            runnerRoots.current.delete(existing);
            existing.remove();
            runBtn.textContent = "▶ 运行";
            runBtn.style.opacity = "0";
            return;
          }

          runBtn.textContent = "运行中...";
          runBtn.style.opacity = "1";

          const container = document.createElement("div");
          container.dataset.pyRunnerPanel = "";
          pre.parentNode?.insertBefore(container, pre.nextSibling);

          const rootEl = createRoot(container);
          runnerRoots.current.set(container, rootEl);
          rootEl.render(<PythonRunner code={codeText} language="python" />);

          runBtn.textContent = "✕ 关闭";
        });
      }

      // Copy button
      if (pre.querySelector(`[${COPY_ATTR}]`)) return;

      const copyBtn = document.createElement("button");
      copyBtn.setAttribute(COPY_ATTR, "");
      copyBtn.textContent = "复制";
      copyBtn.setAttribute("aria-label", "复制代码");
      Object.assign(copyBtn.style, styles.baseBtn("8px"));
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

    return cleanupRunners;
  }, [content, cleanupRunners]);

  return (
    <div
      ref={rootRef}
      className="mdx-content [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary,#0f172a)] [&_h2]:border-b [&_h2]:border-[var(--border-light,#e2e8f0)] [&_h2]:pb-2 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary,#0f172a)] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary,#475569)] [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:text-[var(--text-secondary,#475569)] [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-accent,#3b82f6)] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-secondary,#475569)] [&_hr]:my-8 [&_hr]:border-[var(--border-light,#e2e8f0)] [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:border [&_pre]:border-[var(--border-light,#e2e8f0)] [&_pre]:my-4 [&_code]:text-sm [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:bg-gray-100 [&_p_code]:dark:bg-gray-800 [&_p_code]:text-rose-600 [&_p_code]:dark:text-rose-400 [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:rounded [&_li_code]:bg-gray-100 [&_li_code]:dark:bg-gray-800 [&_li_code]:text-rose-600 [&_li_code]:dark:text-rose-400 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-[var(--border-light,#e2e8f0)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-[var(--border-light,#e2e8f0)] [&_td]:border [&_td]:border-[var(--border-light,#e2e8f0)] [&_td]:px-3 [&_td]:py-2"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
