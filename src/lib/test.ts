// quickVectorTest.ts
import { PineconeStore } from "@langchain/pinecone";
import { index, pineconeClient } from "./pinecone"; // your file that exports pineconeClient and index
import embeddingModel from "@/lib/embeddingModel";
import { PINECONE_NAMESPACE_ABSTRACT } from "@/lib/config";

async function main() {
  const query = "replace with a short phrase you know exists in your data";

  console.log("=== Embedding test ===");
  const emb = await embeddingModel.embedQuery(query);
  console.log("embedding produced:", Array.isArray(emb) ? `yes (len=${emb.length})` : "no");

  console.log("\n=== Index stats (namespace) ===");
  try {
    // index here is the Pinecone Index object you exported from ./pinecone
    const stats = await (index as any).describeIndexStats({ namespace: PINECONE_NAMESPACE_ABSTRACT });
    const nsCount = stats?.namespaces?.[PINECONE_NAMESPACE_ABSTRACT]?.vectorCount ?? stats?.totalVectorCount ?? 0;
    console.log("vector count in namespace:", nsCount);
  } catch (err) {
    console.error("failed to get index stats:", err);
  }

  console.log("\n=== Similarity search (with scores) ===");
  const store = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex: index,
    namespace: PINECONE_NAMESPACE_ABSTRACT,
  });

  try {
    const k = 5;
    const results: Array<[any, number]> = await (store as any).similaritySearchWithScore(query, k);
    console.log("results returned:", results.length);
    results.forEach(([doc, score], i) => {
      const text = ((doc.pageContent ?? doc.content) || "").slice(0, 200).replace(/\s+/g, " ");
      console.log(`[${i}] score=${score} snippet="${text}"`);
    });
  } catch (err) {
    console.error("similaritySearchWithScore failed:", err);
  }

  console.log("\n=== Retriever check ===");
  try {
    const retriever = store.asRetriever({ searchType: "similarity", k: 5 });
    const docs = typeof (retriever as any).getRelevantDocuments === "function"
      ? await (retriever as any).getRelevantDocuments(query)
      : await (retriever as any).retrieve(query);
    console.log("retriever returned:", docs.length);
    if (docs.length) {
      console.log("first doc snippet:", ((docs[0].pageContent ?? docs[0].content) || "").slice(0, 200).replace(/\s+/g, " "));
    }
  } catch (err) {
    console.error("retriever failed:", err);
  }
}

main().catch((e) => {
  console.error("test failed:", e);
  process.exit(1);
});
