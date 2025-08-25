import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX } from "./config";

// Initialize Pinecone client
export const pineconeClient = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// Get the index
export const index = pineconeClient.Index(PINECONE_INDEX);