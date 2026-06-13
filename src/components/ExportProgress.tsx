"use client";

import { useState } from "react";
import { getProgress, getStageProgress } from "@/lib/progress";
import { stages } from "@/data/stages";
import { Download, CheckCheck } from "lucide-react";

export default function ExportProgress() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const progress = getProgress();
    const totalTopics = stages.reduce((sum, s) => sum + s.topics.length, 0);

    // 生成报告
    const now = new Date().toISOString().split("T")[0];
    const completedList = progress.completedTopics
      .map((key: string) => `  - ${key}`)
      .join("\n");

    const report = `# AI Agent 学习进度报告
导出日期: ${now}

## 总览
已完成: ${progress.completedTopics.length} / ${totalTopics} 个知识点
完成率: ${Math.round((progress.completedTopics.length / totalTopics) * 100)}%

## 已学知识点
${completedList || "  （暂无）"}

## 分阶段进度
${stages
  .map((s) => {
    const p = getStageProgress(s.id, s.topics.length);
    return `- ${s.number}. ${s.title}: ${p.completed}/${p.total}`;
  })
  .join("\n")}

---

由 AI Agent 学习路线 导出
`;

    // 下载为 Markdown 文件
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `学习进度-${now}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-light)] text-sm text-[var(--text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
    >
      {exported ? (
        <>
          <CheckCheck className="w-4 h-4 text-[var(--color-success)]" />
          <span className="text-[var(--color-success)]">已导出</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>导出进度</span>
        </>
      )}
    </button>
  );
}
