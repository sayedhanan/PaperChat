/**
 * Creating Retriver on both NameSpaces
 * abstractStore: Pointing to the NameSpace containing the vectors of abstracts.
 * completStore: Pointing to the NameSpace containing the chunks of complete papers.
 * Also returning queryRetriver, to make query from any retriever. 
 */
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import embeddingModel from "./EmbeddingModel.js";
import "./PineconeConfig.js";

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

// Create PineconeStores for both namespaces
const abstractStore = await PineconeStore.fromExistingIndex(embeddingModel, {
  pineconeIndex: index,
  namespace: "Abstract",
});

const completeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
  pineconeIndex: index,
  namespace: "Complete",
});

// Convert stores to retrievers
const abstractRetriever = abstractStore.asRetriever({ k: 1 });
const completeRetriever = completeStore.asRetriever({ k: 1 });

// Query function
async function queryRetriever(retriever, queryText) {
  const results = await retriever.getRelevantDocuments(queryText);
  return results.map(doc => doc);
}

// Example usage
const query = "Explain machine learning";
const abstractResults = await queryRetriever(abstractRetriever, query);
const completeResults = await queryRetriever(completeRetriever, query);

// console.log("Abstract Results:", abstractResults);
// console.log("Complete Results:", completeResults);

export { abstractRetriever, completeRetriever, queryRetriever };
