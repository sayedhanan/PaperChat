import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { promptTemplate } from "./promptTemplate";
import { chatModel } from "./chatModel";
import { completeStoreRetriever } from "./vectorStores";

// Create the retrieval chain
export async function createRAGChain(paperId) {
  const combineDocsChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt: promptTemplate,
  });

  const retriever = await completeStoreRetriever(paperId);

  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  return retrievalChain;
}