// Pyodide 浏览器内 Python 运行管理器

const PYODIDE_VERSION = "v0.26.4";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

interface PyodideInstance {
  runPython(code: string): unknown;
  globals: {
    get(key: string): unknown;
  };
}

interface PyodideConfig {
  indexURL: string;
}

// loadPyodide is injected as a global by the Pyodide CDN script
declare function loadPyodide(config: PyodideConfig): Promise<PyodideInstance>;

let pyodideInstance: PyodideInstance | null = null;
let loadPromise: Promise<PyodideInstance> | null = null;

export async function getPyodide(): Promise<PyodideInstance> {
  if (pyodideInstance) return pyodideInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const script = document.createElement("script");
    script.src = `${PYODIDE_BASE_URL}pyodide.js`;
    document.head.appendChild(script);

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    });

    pyodideInstance = await loadPyodide({ indexURL: PYODIDE_BASE_URL });

    return pyodideInstance;
  })();

  return loadPromise;
}

export interface RunResult {
  output: string;
  error: string | null;
}

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
    pyodide.runPython(RUN_WRAPPER);
    pyodide.runPython(code);
    const output = String(pyodide.runPython(GET_OUTPUT) || "");
    return { output, error: null };
  } catch (e: unknown) {
    try { pyodide.runPython(RESTORE_STDOUT); } catch { /* ignore */ }
    const message = e instanceof Error ? e.message : String(e);
    return { output: "", error: message };
  }
}
