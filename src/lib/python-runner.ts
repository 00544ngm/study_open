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

let runCounter = 0;

const RUN_WRAPPER = `
import sys, io
_run_buf = io.StringIO()
_run_old = sys.stdout
sys.stdout = _run_buf
`;

const RESTORE_STDOUT = `
sys.stdout = _run_old
`;

const GET_OUTPUT = `
sys.stdout = _run_old
get_value = _run_buf.getvalue()
get_value
`;

export async function runPython(code: string): Promise<RunResult> {
  const pyodide = await getPyodide();

  try {
    // Redirect stdout
    (pyodide as any).runPython(RUN_WRAPPER);

    // Run user code
    (pyodide as any).runPython(code);

    // Restore stdout and get output
    const output = (pyodide as any).runPython(GET_OUTPUT) || "";
    return { output, error: null };
  } catch (e: any) {
    // Restore stdout on error too
    try { (pyodide as any).runPython(RESTORE_STDOUT); } catch {}
    return {
      output: "",
      error: e.message || String(e),
    };
  }
}
