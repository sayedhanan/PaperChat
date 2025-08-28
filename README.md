# Research Paper Search & Q\&A (RAG)


Disclaimer: This is a demo project, I am trying to simulate as readl world problem.

A lightweight Next.js app that lets you **search research paper abstracts** (via a vector index) and **ask questions** about a selected paper using a Retrieval-Augmented-Generation (RAG) chain. The project includes a small `rag-core/` utilities folder for indexing, chunking, embedding, and querying the vector store.

Built with: **Next.js (App Router)**, **LangChain**, **Pinecone**, and an LLM (OpenAI by default in examples). Embeddings use `llama-text-embed-v2` in the provided `rag-core` code.

---

## Table of contents

- [Research Paper Search \& Q\&A (RAG)](#research-paper-search--qa-rag)
  - [Table of contents](#table-of-contents)
  - [What it does](#what-it-does)
  - [Project layout](#project-layout)
  - [rag-core overview](#rag-core-overview)
  - [Quick start](#quick-start)
  - [Environment variables](#environment-variables)
  - [Important files \& routes](#important-files--routes)
  - [How to run indexing \& queries (rag-core)](#how-to-run-indexing--queries-rag-core)
  - [Best practices \& notes](#best-practices--notes)
  - [Troubleshooting](#troubleshooting)
  - [Roadmap \& ideas](#roadmap--ideas)
  - [License](#license)

---

## What it does

* Indexes research-paper abstracts and full paper chunks into a vector store (Pinecone). Abstracts are stored as one vector per abstract; full papers are chunked and stored as multiple vectors.
* Provides a search endpoint that returns top-`k` abstract matches.
* Provides an ask endpoint that runs a RAG chain (retriever + LLM) optionally filtered to a single paper.
* Client UI: search page (`/`), results list, and a paper page `/paper/[id]` with a chat interface for Q\&A on that specific paper.

---

## Project layout

```
/ (repo root)
├─ app/
│  ├─ page.jsx               # Search UI
│  ├─ paper/[id]/page.jsx    # Paper page (client or server component)
├─ api/
│  ├─ search/route.js        # POST /api/search
│  ├─ ask/route.js           # POST /api/ask
├─ lib/
│  ├─ pinecone.js            # Pinecone client helper
│  ├─ vectorStores.js        # abstract/complete retriever builders
│  ├─ retrievalChain.js      # RAG chain builder
│  └─ ...
├─ rag-core/                 # utilities for preparing and populating vectors
│  ├─ DataLoader.js          # load source documents (json, pdf, etc.)
│  ├─ Chunking.js            # chunk full papers (NOT abstracts)
│  ├─ EmbeddingModel.js      # wrapper for llama-text-embed-v2
│  ├─ Populate.js            # script to embed & populate Pinecone
│  └─ Query.js               # simple query examples / test scripts
├─ package.json
└─ README.md
```

---

## rag-core overview

`rag-core/` contains the data-prep and vector-population utilities used to create the `abstract` and `complete` namespaces in your Pinecone index.

* **DataLoader.js**

  * Loads raw paper data (JSON, JSONL, or other formats).
  * Normalizes fields into a canonical metadata shape: `{ id, title, authors, abstract, source, _line }`.
  * For large PDFs you may implement an extra PDF extractor before chunking.

* **Chunking.js**

  * Responsible for splitting *complete papers* (full text) into smaller chunks for RAG.
  * **Important:** abstracts are **not** chunked — you should store 1 vector per abstract (one vector = whole abstract). Only full papers are chunked into many vectors.
  * The chunker should preserve provenance metadata (paper id, chunk index, character offsets, source link).

* **EmbeddingModel.js**

  * Wraps the embedding model (default in your project: `llama-text-embed-v2`).
  * Exposes a simple `embed(text)` or `embedBatch([texts])` API that returns vector arrays.

* **Populate.js**

  * Orchestrates embedding and upserting into Pinecone.
  * Typical flow:

    1. Load items via `DataLoader`.
    2. For abstracts: embed each abstract and upsert with metadata keys (id, title, authors, abstract).
    3. For complete papers: chunk via `Chunking`, embed chunks, upsert chunks with metadata pointing to `paperId` and `chunkIndex`.
  * Use batching and rate-limit handling. Store vector metadata keys consistently so retrieval filters work.

* **Query.js**

  * Lightweight scripts to sanity-check the index: run local queries against Pinecone, confirm metadata keys, and test `fetch` vs `query` behaviors.

---

## Quick start

```bash
# install
npm install

# create .env.local (see below)
cp .env.example .env.local
# edit .env.local with your keys

# dev server
npm run dev
# open http://localhost:3000
```

To populate your index with rag-core (example):

```bash
# from project root
node rag-core/Populate.js --mode=abstract   # populate abstracts namespace
node rag-core/Populate.js --mode=complete   # chunk + populate complete namespace
```

Exact CLI flags depend on your script — check the top of `Populate.js` for usage.

---

## Environment variables

Add these to `.env.local` (adjust names to match your code):

```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=research-papers-index
PINECONE_NAMESPACE_ABSTRACT=abstract
PINECONE_NAMESPACE_COMPLETE=complete
EMBEDDING_MODEL=llama-text-embed-v2
```

> **Keep these secret** and never expose them in client-side code.

---

## Important files & routes

* `app/page.jsx` — Search UI (client). POSTs to `/api/search`.
* `api/search/route.js` — POST `{ query }`, returns top-k abstract matches.
* `api/ask/route.js` — POST `{ query, paperId }`, runs RAG chain and returns `answer` + `context`.
* `lib/vectorStores.js` — creates Pinecone retrievers for `abstract` and `complete` namespaces. Example callers:

  * `abstractStoreRetriever()` — `k: 5` (one vector per abstract)
  * `completeStoreRetriever(paperId)` — `k: 2` with optional filter to restrict to a paper's chunks
* `rag-core/Populate.js` — script to embed and upsert vectors (both abstract and complete)

---

## How to run indexing & queries (rag-core)

1. **Prepare data**: put raw paper JSON/JSONL into a data folder. Ensure abstracts are present.
2. **Populate abstracts**: run `Populate.js --mode=abstract` to create a single vector per abstract.
3. **Populate complete papers**: run `Populate.js --mode=complete` which will:

   * Read full text
   * Chunk into pieces via `Chunking.js`
   * Embed chunks and upsert into `PINECONE_NAMESPACE_COMPLETE`
4. **Test**: run `node rag-core/Query.js --q "your query"` to see results and metadata.

---

## Best practices & notes

* **One vector per abstract**: easier and faster for short-search UX. Keep `k` small for abstracts.
* **Chunk full papers**: chunk size \~ 500 tokens (or 200–1000 depending on model) is common. Preserve overlap (e.g., 50–100 tokens) for context continuity.
* **Consistent metadata**: store `id`, `title`, `authors`, `abstract`, `source`, and any provenance fields (`chunkIndex`, `charStart`, `charEnd`, `_line`) to enable filtering and source display.
* **Filtering by paper**: when running RAG for a specific paper, ensure your retriever filter matches the metadata key (`metadata.id` or `metadata.paperId`) exactly. Confirm the shape required by your Pinecone/LangChain versions.
* **Embeddings**: `llama-text-embed-v2` is supported if configured. If you switch providers, update `rag-core/EmbeddingModel.js` accordingly.
* **Batching and rate limits**: embed in batches and upsert in batches to avoid throttling.

---

## Troubleshooting

* **Empty paper page**: confirm you either fetch metadata in a server component (recommended) or implement client fetch to `/api/paper/{id}`. Also ensure `result.metadata.id` is filled when navigating from search results.
* **Filter not applied**: verify `retrieverConfig.filter` uses the correct metadata key and operator (some versions require `{ id: { $eq: paperId } }`).
* **Scores missing**: if you need scores, request them in your Pinecone query or use store APIs that return similarity scores.
* **Server build errors**: do not import browser-only UI libs in server-only modules (e.g., `lucide-react` in `lib/*`).

---

## Roadmap & ideas

* Add provenance links and highlight context chunks used in RAG answers.
* Provide server-side rendering for paper pages (SEO + immediate content).
* Add admin tooling to re-index or patch metadata for papers.
* Add rate-limited background worker for large re-index runs.

---

## License

MIT © Sayed Hanan
