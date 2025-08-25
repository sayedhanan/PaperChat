import { ChatPromptTemplate } from "@langchain/core/prompts";

export const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful research assistant.
    Answer the user's question using only the provided context.
    If the context doesn't help, honestly respond with "I don't know.
    Explain things in detail, but as you are explainint to a kid, 
    keep langaug very simple"

    Context: {context}`
  ],
  ["human", "{input}"]
]);