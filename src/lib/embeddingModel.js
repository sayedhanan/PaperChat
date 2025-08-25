import { PineconeEmbeddings } from "@langchain/pinecone";

// Embedding model (same as you used for storing)
const embeddingModel = new PineconeEmbeddings({
  model: "llama-text-embed-v2",
});

let result = embeddingModel.embedQuery("I am Hanan!")
console.log(result)
export default embeddingModel;