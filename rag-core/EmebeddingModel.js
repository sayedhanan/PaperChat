import { PineconeEmbeddings } from "@langchain/pinecone";
import "./PineconeConfig.js";

const embeddingModel = new PineconeEmbeddings({
  model: "llama-text-embed-v2",
});

export default embeddingModel;