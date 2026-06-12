/// <reference types="com" />
// Pyodide 浏览器内 Python 运行管理器

type PyodideModule = {
  runPython(code: string): unknown;
  globals: {
    get(key: string): unknown;
  };
  FS?: {
    writeFile(path: string, content: string): void;
    readFile(path: string, encoding: string): string;
  };
};

let pyodideInstance: PyodideModule | null = null;
let loadPromise: Promise<PyodideModule> | null = null;

export async function getPyodide(): Promise<PyodideModule> {
  if (pyodideInstance) return pyodideInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    document.head.appendChild(script);

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    });

    // @ts-expect-error - Pyodide is loaded as a global
    pyodideInstance = await globalThis.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });

    return pyodideInstance!;
  })();

  return loadPromise;
}

export interface RunResult {
  output: string;
  error: string | null;
}

export async function runPython(code: string): Promise<RunResult> {
  const pyodide = await getPyodide();

  // Capture stdout
  let output = "";
  const oldStdout = (pyodide as any).runPython(`
import sys
from io import StringIO
_buffer = StringIO()
_old_stdout = sys.stdout
sys.stdout = _buffer
  `);

  try {
    (pyodide as any).runPython(code);
    const captured = (pyodide as any).runPython(`
sys.stdout = _old_stdout
result = _buffer.getvalue()
result
    `);
    output = captured || "";
    return { output, error: null };
  } catch (e: any) {
    // Restore stdout even on error
    try {
      (pyodide as any).runPython("sys.stdout = _old_stdout");
    } catch {}
    return {
      output,
      error: e.message || String(e),
    };
  }
}
