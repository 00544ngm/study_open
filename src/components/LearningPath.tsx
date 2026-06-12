"use client";

import Link from "next/link";
import { stages } from "@/data/stages";
import { BookOpen, ArrowRight } from "lucide-react";

interface Props {
  currentStage: string;
  currentTopic: string;
}

interface ResolvedPrereq {
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
}

function resolvePrereqs(keys: string[]): ResolvedPrereq[] {
  return keys
    .map((key) => {
      const [stageId, topicId] = key.split("/");
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) return null;
      const topic = stage.topics.find((t) => t.id === topicId);
      if (!topic) return null;
      return { stageId, stageTitle: stage.title, topicId, topicTitle: topic.title };
    })
    .filter((r): r is ResolvedPrereq => r !== null);
}

function findFutureTopics(stageId: string, topicId: string): ResolvedPrereq[] {
  const result: ResolvedPrereq[] = [];
  const key = `${stageId}/${topicId}`;
  for (const stage of stages) {
    for (const topic of stage.topics) {
      if (topic.prerequisites?.includes(key)) {
        result.push({
          stageId: stage.id,
          stageTitle: stage.title,
          topicId: topic.id,
          topicTitle: topic.title,
        });
      }
    }
  }
  return result;
}

export default function LearningPath({ currentStage, currentTopic }: Props) {
  const stage = stages.find((s) => s.id === currentStage);
  const topic = stage?.topics.find((t) => t.id === currentTopic);
  if (!topic) return null;

  const prereqs = topic.prerequisites ? resolvePrereqs(topic.prerequisites) : [];
  const futures = findFutureTopics(currentStage, currentTopic);

  if (prereqs.length === 0 && futures.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-[var(--border-light)] space-y-4">
      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-500" />
            前置准备
          </h3>
          <div className="flex flex-wrap gap-2">
            {prereqs.map((p) => (
              <Link
                key={`${p.stageId}/${p.topicId}`}
                href={`/stages/${p.stageId}/${p.topicId}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                {p.stageTitle}/{p.topicTitle}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {futures.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            继续学习
          </h3>
          <div className="flex flex-wrap gap-2">
            {futures.map((f) => (
              <Link
                key={`${f.stageId}/${f.topicId}`}
                href={`/stages/${f.stageId}/${f.topicId}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                {f.stageTitle}/{f.topicTitle}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
