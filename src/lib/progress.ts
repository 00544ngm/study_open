"use client";

const STORAGE_KEY = "learning-progress";
const RECENT_KEY = "learning-recent";
const INTEREST_KEY = "learning-interests";

export interface Progress {
  completedTopics: string[]; // "stage/topic/slug" format
}

export function getProgress(): Progress {
  if (typeof window === "undefined") return { completedTopics: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedTopics: [] };
  } catch {
    return { completedTopics: [] };
  }
}

export function toggleTopic(key: string): Progress {
  const progress = getProgress();
  const idx = progress.completedTopics.indexOf(key);
  if (idx >= 0) {
    progress.completedTopics.splice(idx, 1);
  } else {
    progress.completedTopics.push(key);
    addRecent(key);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function isCompleted(key: string): boolean {
  return getProgress().completedTopics.includes(key);
}

export function getStageProgress(stageId: string, totalTopics: number): { completed: number; total: number } {
  const progress = getProgress();
  const completed = progress.completedTopics.filter((k) => k.startsWith(stageId)).length;
  return { completed, total: totalTopics };
}

// 最近学习记录
export function addRecent(key: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list: Array<{ key: string; time: number }> = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((item) => item.key !== key);
    filtered.unshift({ key, time: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {
    // ignore
  }
}

export function getRecent(): Array<{ key: string; time: number }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 感兴趣标记
export function toggleInterest(key: string): string[] {
  try {
    const raw = localStorage.getItem(INTEREST_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const idx = list.indexOf(key);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(key);
    }
    localStorage.setItem(INTEREST_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [];
  }
}

export function isInterested(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(INTEREST_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(key);
  } catch {
    return false;
  }
}

export function getInterested(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INTEREST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
