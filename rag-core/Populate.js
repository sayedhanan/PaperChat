/**
 * Main Script: 
 * Importing all the scripts, and loading to populate the vector database.
 * Creating 2 NameSpaces "complete" and "abstract"
 * Abstract: Containing the abstract's (summary) of Research Papers.
 * Complete: Containing complete chunks of complete Research Papers.
 */
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import CustomDataLoader, { FILE_PATH } from "./DataLoader.js";
import embeddingModel from "./EmbeddingModel.js";
import textSplitter from "./Chunking.js";
import "./PineconeConfig.js";


// This can be slightly different, how your 'API' or 'Secrets' are stored.
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});
const indexName = process.env.PINECONE_INDEX;
const pineconeIndex = pineconeClient.Index(indexName);



// ===== ABSTRACTS =====
console.log("Loading abstract documents...");
const abstractLoader = new CustomDataLoader(FILE_PATH, "abstract");
const abstractDocuments = await abstractLoader.load();
console.log(typeof abstractDocuments);

console.log("Storing abstracts (no chunking)...");

return await PineconeStore.fromDocuments(
    abstractBatches[i],
    embeddingModel,
    {
        pineconeIndex,
        maxConcurrency: 1,
        namespace: "Abstract",
    }
);


// ===== COMPLETE PAPERS =====
console.log("Loading complete documents...");
const completeLoader = new CustomDataLoader(FILE_PATH, "complete");
const completeDocuments = await completeLoader.load();
console.log(typeof completeDocuments);

console.log("Chunking complete documents...");
const completeChunks = await textSplitter.splitDocuments(completeDocuments);
console.log("Chunk count:", completeChunks.length);

console.log("Storing complete chunks in batches...");
// Process chunks in batches to avoid exceeding the model limit
const chunkBatches = await processBatches(completeChunks, 20);

return await PineconeStore.fromDocuments(
    chunkBatches[i],
    embeddingModel,
    {
        pineconeIndex,
        maxConcurrency: 1,
        namespace: "Complete",
    }
);

console.log("Data population completed successfully!");