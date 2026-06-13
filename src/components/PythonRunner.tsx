"use client";

import { useState, useRef, useCallback } from "react";
import { runPython } from "@/lib/python-runner";
import { Play, Loader2, Terminal, X, RotateCcw } from "lucide-react";

interface Props {
  code: string;
  language?: string;
}

export default function PythonRunner({ code, language = "python" }: Props) {
  const [open, setOpen] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const outputRef = useRef<HTMLPreElement>(null);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      setRunning(true);
      const result = await runPython(editableCode);
      setOutput(result.output);
      setError(result.error);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
      setLoading(false);
    }
  }, [editableCode]);

  const handleReset = () => {
    setEditableCode(code);
    setOutput("");
    setError(null);
  };

  const lines = editableCode.split("\n");
  const lineCount = lines.length;

  return (
    <div className="my-4 rounded-lg border border-[var(--border-light, #334155)] overflow-hidden bg-[#0d1117]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-light, #334155)] bg-[#161b22]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted, #94a3b8)]">
          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
          {language === "python" ? "Python" : language}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(!open)}
            className="px-2 py-1 text-xs text-[var(--text-muted, #94a3b8)] hover:text-[var(--text-primary, #f1f5f9)] rounded hover:bg-white/5 transition-colors"
          >
            {open ? "收起" : "编辑并运行"}
          </button>
        </div>
      </div>

      {/* Read-only code display when not open */}
      {!open ? (
        <pre className="p-4 text-sm leading-relaxed overflow-x-auto text-gray-300">
          <code>{editableCode}</code>
        </pre>
      ) : (
        <>
          {/* Editable code area */}
          <div className="flex">
            {/* Line numbers */}
            <div className="select-none px-3 py-4 text-right text-xs leading-[1.7] text-gray-500 font-mono border-r border-[var(--border-light, #334155)] bg-[#0d1117] shrink-0">
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code editor */}
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="flex-1 p-4 text-sm leading-[1.7] font-mono bg-transparent text-gray-300 outline-none resize-none border-none"
              spellCheck={false}
              style={{ minHeight: `${Math.max(lineCount, 1) * 1.7 + 2}rem` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-[var(--border-light, #334155)] bg-[#161b22]">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#238636] hover:bg-[#2ea043] rounded-md transition-colors disabled:opacity-50"
              aria-label="运行代码"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              )}
              {loading ? "加载运行环境..." : running ? "运行中..." : "运行"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-[var(--text-muted, #94a3b8)] hover:text-[var(--text-primary, #f1f5f9)] rounded hover:bg-white/5 transition-colors"
              aria-label="重置代码到原始状态"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              重置
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-[var(--text-muted, #94a3b8)] hover:text-[var(--text-primary, #f1f5f9)] rounded hover:bg-white/5 transition-colors"
              aria-label="关闭编辑器"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Output area */}
          {(output || error) && (
            <div className="border-t border-[var(--border-light, #334155)]">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-muted, #94a3b8)] bg-[#161b22] border-b border-[var(--border-light, #334155)]">
                <Terminal className="w-3 h-3" aria-hidden="true" />
                输出
              </div>
              <pre
                ref={outputRef}
                className={`p-4 text-sm leading-relaxed overflow-x-auto font-mono ${
                  error ? "text-red-400" : "text-gray-300"
                }`}
              >
                {error || output || "（无输出）"}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
