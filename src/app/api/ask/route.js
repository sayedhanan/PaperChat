import { NextRequest, NextResponse } from "next/server";
import { createRAGChain } from "@/lib/retrievalChain";
import { AskResponse } from "@/lib/types";

export async function POST(request) {
  try {
    const { query, paperId } = await request.json();

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log("Processing question:", query);
    console.log("Paper ID filter:", paperId || "None (searching all papers)");

    // Create the RAG chain with optional paper filtering
    const retrievalChain = await createRAGChain(paperId);
    
    // Run the query through the chain
    const response = await retrievalChain.invoke({
      input: query,
    });

    console.log("Generated answer:", response.answer);
    console.log("Context chunks used:", response.context?.length || 0);

    const result = {
      answer: response.answer,
      context: response.context || [],
      query,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ask API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST method with query in body" });
}