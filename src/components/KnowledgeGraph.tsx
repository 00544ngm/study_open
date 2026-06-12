"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAllStages } from "@/data/stages";

interface Props {
  showAll?: boolean;
  height?: number;
}

/* ── Color maps ────────────────────────────────────────────── */

const GRADIENT_MAP: Record<string, [string, string]> = {
  "from-blue-500 to-cyan-500":      ["#3b82f6", "#06b6d4"],
  "from-emerald-500 to-teal-500":   ["#10b981", "#14b8a6"],
  "from-violet-500 to-purple-500":  ["#8b5cf6", "#a855f7"],
  "from-orange-500 to-red-500":     ["#f97316", "#ef4444"],
  "from-pink-500 to-rose-500":      ["#ec4899", "#f43f5e"],
  "from-indigo-500 to-blue-500":    ["#6366f1", "#3b82f6"],
  "from-amber-500 to-yellow-500":   ["#f59e0b", "#eab308"],
  "from-slate-600 to-slate-800":    ["#475569", "#1e293b"],
  "from-green-500 to-lime-500":     ["#22c55e", "#84cc16"],
  "from-teal-500 to-cyan-600":      ["#14b8a6", "#0891b2"],
};

const DIFFICULTY_COLORS = {
  beginner:     "#10b981",
  intermediate: "#3b82f6",
  advanced:     "#8b5cf6",
} as const;

/* ── Layout constants ─────────────────────────────────────── */

const STAGE_W         = 200;
const STAGE_H         = 90;
const STAGE_GAP       = 90;
const TOPIC_W         = 170;
const TOPIC_H         = 28;
const TOPIC_GAP       = 8;
const PADDING         = 40;
const TOPICS_OFFSET_Y = 18;

/* ── Helpers ──────────────────────────────────────────────── */

function getDifficulty(index: number, total: number): keyof typeof DIFFICULTY_COLORS {
  const ratio = index / total;
  if (ratio < 0.4) return "beginner";
  if (ratio < 0.75) return "intermediate";
  return "advanced";
}

/* ── Component ────────────────────────────────────────────── */

export default function KnowledgeGraph({ showAll = false, height }: Props) {
  const router = useRouter();
  const stages = useMemo(() => getAllStages(), []);

  const [expanded, setExpanded] = useState<Set<string>>(
    () => (showAll ? new Set(stages.map((s) => s.id)) : new Set()),
  );
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  /* ── derived state ───────────────────────────────────── */

  const toggleStage = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeStageId =
    hoveredStage ??
    (hoveredTopic
      ? stages.find((s) => s.topics.some((t) => t.id === hoveredTopic))?.id ?? null
      : null);

  const isDimmed = (stageId: string) =>
    activeStageId !== null && activeStageId !== stageId;

  const isTopicDimmed = (topicId: string) => {
    if (!activeStageId) return false;
    const stage = stages.find((s) => s.id === activeStageId);
    return !stage?.topics.some((t) => t.id === topicId);
  };

  /* ── SVG dimensions ──────────────────────────────────── */

  const svgWidth = stages.length * (STAGE_W + STAGE_GAP) - STAGE_GAP + PADDING * 2;

  const svgHeight = useMemo(() => {
    if (height) return height;
    let maxH = PADDING + STAGE_H + PADDING;
    for (const stage of stages) {
      if (expanded.has(stage.id)) {
        const h =
          PADDING +
          STAGE_H +
          TOPICS_OFFSET_Y +
          stage.topics.length * (TOPIC_H + TOPIC_GAP) +
          PADDING;
        maxH = Math.max(maxH, h);
      }
    }
    return maxH;
  }, [stages, expanded, height]);

  /* ── position helpers ────────────────────────────────── */

  const stageX = (i: number) => PADDING + i * (STAGE_W + STAGE_GAP);
  const stageY = () => PADDING;
  const topicY = (_stageIndex: number, topicIndex: number) =>
    PADDING + STAGE_H + TOPICS_OFFSET_Y + topicIndex * (TOPIC_H + TOPIC_GAP);

  /* ── guard ───────────────────────────────────────────── */

  if (stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--text-muted)]">
        No stages available
      </div>
    );
  }

  /* ── render ──────────────────────────────────────────── */

  return (
    <div className="overflow-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        className="min-w-full"
        style={{ display: "block" }}
      >
        <defs>
          {/* Arrowhead marker */}
          <marker
            id="arr"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path
              d="M 0 1 L 8 5 L 0 9"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>

          {/* Per-stage linear gradients */}
          {stages.map((s) => {
            const [from, to] = GRADIENT_MAP[s.color] ?? ["#3b82f6", "#06b6d4"];
            return (
              <linearGradient
                key={s.id}
                id={`grad-${s.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={from} />
                <stop offset="100%" stopColor={to} />
              </linearGradient>
            );
          })}
        </defs>

        {/* ── Connector arrows ──────────────────────────── */}
        {stages.slice(0, -1).map((_, i) => {
          const x1 = stageX(i) + STAGE_W;
          const y1 = stageY() + STAGE_H / 2;
          const x2 = stageX(i + 1);
          const y2 = stageY() + STAGE_H / 2;
          return (
            <line
              key={`arr-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--text-muted)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              markerEnd="url(#arr)"
              opacity={activeStageId ? 0.2 : 0.45}
              style={{ transition: "opacity 0.25s" }}
            />
          );
        })}

        {/* ── Stage nodes ───────────────────────────────── */}
        {stages.map((stage, i) => {
          const sx = stageX(i);
          const sy = stageY();
          const dim = isDimmed(stage.id);
          const isExpanded = expanded.has(stage.id);

          return (
            <g key={stage.id}>
              {/* Stage card */}
              <g
                className="cursor-pointer select-none"
                onClick={() => toggleStage(stage.id)}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                style={{ transition: "opacity 0.25s" }}
                opacity={dim ? 0.25 : 1}
              >
                {/* Background */}
                <rect
                  x={sx}
                  y={sy}
                  width={STAGE_W}
                  height={STAGE_H}
                  rx={12}
                  fill={`url(#grad-${stage.id})`}
                  stroke={activeStageId === stage.id ? "var(--color-accent)" : "none"}
                  strokeWidth={activeStageId === stage.id ? 2 : 0}
                  style={{
                    transition: "stroke 0.2s, filter 0.2s",
                    filter:
                      activeStageId === stage.id
                        ? "brightness(1.12)"
                        : "brightness(1)",
                  }}
                />

                {/* Stage number badge */}
                <rect
                  x={sx + STAGE_W / 2 - 28}
                  y={sy + 10}
                  width={56}
                  height={18}
                  rx={9}
                  fill="rgba(255,255,255,0.2)"
                />
                <text
                  x={sx + STAGE_W / 2}
                  y={sy + 23}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.9)"
                  fontSize={10}
                  fontWeight={600}
                >
                  阶段 {stage.number}
                </text>

                {/* Title */}
                <text
                  x={sx + STAGE_W / 2}
                  y={sy + 48}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={18}
                  fontWeight={700}
                >
                  {stage.title}
                </text>

                {/* Subtitle */}
                <text
                  x={sx + STAGE_W / 2}
                  y={sy + 65}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.65)"
                  fontSize={10}
                  fontWeight={500}
                >
                  {stage.subtitle}
                </text>

                {/* Topic count + expand indicator */}
                <text
                  x={sx + STAGE_W / 2}
                  y={sy + STAGE_H - 6}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize={9}
                >
                  {stage.topics.length} 个知识点
                  {isExpanded ? "  ▴" : "  ▾"}
                </text>
              </g>

              {/* ── Topic nodes ──────────────────────────── */}
              {stage.topics.map((topic, j) => {
                const ty = topicY(i, j);
                const diff = getDifficulty(j, stage.topics.length);
                const color = DIFFICULTY_COLORS[diff];
                const tDimmed = isTopicDimmed(topic.id);
                const tVisible = isExpanded;

                return (
                  <g
                    key={topic.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/stages/${stage.id}/${topic.id}`)
                    }
                    onMouseEnter={() => setHoveredTopic(topic.id)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    style={{
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                      opacity: tVisible ? (tDimmed ? 0.25 : 1) : 0,
                      transform: tVisible
                        ? "translateY(0)"
                        : "translateY(-8px)",
                      pointerEvents: tVisible ? "auto" : ("none" as const),
                    }}
                  >
                    {/* Topic pill background */}
                    <rect
                      x={sx + (STAGE_W - TOPIC_W) / 2}
                      y={ty}
                      width={TOPIC_W}
                      height={TOPIC_H}
                      rx={14}
                      fill="var(--bg-card)"
                      stroke={color}
                      strokeWidth={1.5}
                      style={{
                        transition: "fill 0.2s, filter 0.2s",
                        filter:
                          hoveredTopic === topic.id
                            ? "brightness(0.95)"
                            : "brightness(1)",
                      }}
                    />

                    {/* Topic text */}
                    <text
                      x={sx + STAGE_W / 2}
                      y={ty + TOPIC_H / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={color}
                      fontSize={12}
                      fontWeight={500}
                    >
                      {topic.title}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
