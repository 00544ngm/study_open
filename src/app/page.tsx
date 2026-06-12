"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllStages } from "@/data/stages";
import StageCard from "@/components/StageCard";
import ProgressBar from "@/components/ProgressBar";
import ExportProgress from "@/components/ExportProgress";
import RecentLearning from "@/components/RecentLearning";
import InterestedSection from "@/components/InterestedSection";
import { getProgress, getStageProgress } from "@/lib/progress";
import { GraduationCap, ArrowRight, BookOpen, Zap, Clock } from "lucide-react";

const totalTopics = getAllStages().reduce((sum, s) => sum + s.topics.length, 0);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const progress = mounted ? getProgress() : { completedTopics: [] };
  const completedTopics = progress.completedTopics.length;
  const stages = getAllStages();

  // 估算学习时长
  const estimatedHours = stages.length * 3; // 粗略估算

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[var(--color-accent)]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              AI Agent 学习路线
            </h1>
          </div>
          {mounted && <ExportProgress />}
        </div>
        <p className="text-[var(--text-secondary)] mb-6 max-w-2xl">
          从零开始，系统掌握 AI Agent 开发所需的全栈技术栈。
          按照 {stages.length} 个阶段循序渐进，每个知识点从入门到进阶，配合代码实战。
        </p>

        {/* Stats */}
        {mounted && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] text-sm">
              <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-[var(--text-muted)]">知识点</span>
              <span className="font-medium text-[var(--text-primary)]">{totalTopics}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[var(--text-muted)]">已学</span>
              <span className="font-medium text-[var(--text-primary)]">{completedTopics}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-[var(--text-muted)]">预估总时长</span>
              <span className="font-medium text-[var(--text-primary)]">{estimatedHours}+ 小时</span>
            </div>
          </div>
        )}

        <ProgressBar completed={completedTopics} total={totalTopics} />
      </section>

      {mounted && <RecentLearning />}
      {mounted && <InterestedSection />}

      {/* Stages Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stages.map((stage) => (
          <StageCard key={stage.id} stage={stage} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/stages/01-basics"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          开始学习 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
