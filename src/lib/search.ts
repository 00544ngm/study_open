export interface SearchResult {
  stageId: string;
  stageTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  title: string;
  content: string;
}

// In-memory search index built at build time
let searchIndex: SearchResult[] = [];

export function setSearchIndex(index: SearchResult[]) {
  searchIndex = index;
}

export function search(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return searchIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
  ).slice(0, 20);
}

export function getSearchIndex() {
  return searchIndex;
}
