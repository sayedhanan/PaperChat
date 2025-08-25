/**
 * Splitting Documents into digestable pieces or chunks
 * so can be feeded to model as a context.
 * We don't need to chunk abstract documents, just complete documents.
 * Reason: Size of abstract is small, so its better to have 1 vector per abstract.
 */
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 4000,
  chunkOverlap: 600,
});


// const complete_splits = await textSplitter.splitDocuments(completeDocuments);

export default textSplitter;