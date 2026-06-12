import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import KnowledgeGraph from "@/components/KnowledgeGraph";

export const metadata = {
  title: "知识图谱 - AI Agent 学习路线",
  description: "可视化浏览 AI Agent 学习路线所有阶段和知识点，了解学习流向与模块依赖关系",
};

export default function GraphPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="w-8 h-8 text-[var(--color-accent)]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            知识图谱
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          可视化浏览所有学习阶段和知识点，了解各阶段之间的学习流向。
          点击阶段卡片展开知识点，点击知识点跳转至对应学习页面。
        </p>
      </div>

      {/* Graph */}
      <KnowledgeGraph showAll />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#10b981" }}
          />
          入门
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#3b82f6" }}
          />
          核心
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          进阶
        </span>
        <span className="flex items-center gap-1.5 ml-1">
          <span className="w-6 border-t border-dashed border-[var(--text-muted)] opacity-40" />
          学习流向
        </span>
        <span className="flex items-center gap-1.5 ml-1">
          <span className="inline-block w-3 h-3 rounded border border-[var(--border-light)] bg-[var(--bg-card)]" />
          知识点
        </span>
      </div>
    </div>
  );
}
