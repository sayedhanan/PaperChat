import { PineconeStore } from "@langchain/pinecone";
import { index } from "./pinecone";
import { PINECONE_NAMESPACE_ABSTRACT, PINECONE_NAMESPACE_COMPLETE } from "./config";
import embeddingModel from "./embeddingModel";

// Abstract retriever
export const abstractStoreRetriever = async () => {
  const store = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex: index,
    namespace: PINECONE_NAMESPACE_ABSTRACT,
  });
  return store.asRetriever({
    searchType: "similarity",
    k: 5, // top-k results
  });
};

// Complete retriever (filtered later by id)
export const completeStoreRetriever = async (paperId) => {
  const store = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex: index,
    namespace: PINECONE_NAMESPACE_COMPLETE,
  });
 
  const retrieverConfig = {
    searchType: "similarity",
    k: 2
  }

  if (paperId) {
    retrieverConfig.filter = {'id': paperId} // id string or not?
  }
 
  return store.asRetriever(retrieverConfig)
};