// Paper metadata structure (based on your Store.js)
export interface PaperMetadata {
  id: number; // arXiv paper ID (e.g., 2309.12494)
  title: string;
  link: string;
  authors: string; // Note: from your example, it's a string, not array
  level: "abstract" | "complete";
  _line?: number;
  _source?: string;
}

// Search result from Pinecone
export interface SearchResult {
  id: string; // This is Pinecone's internal ID (the hash)
  score: number;
  metadata: PaperMetadata;
  pageContent: string;
}

// API response for abstract search
export interface AbstractSearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
}

// API response for ask endpoint
export interface AskResponse {
  answer: string;
  context: any[]; // Document chunks used for context
  query: string;
}