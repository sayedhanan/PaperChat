import { NextRequest, NextResponse } from "next/server";
import { abstractStoreRetriever } from "@/lib/vectorStores";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log("Searching for:", query);

    // Get the abstract retriever
    const retriever = await abstractStoreRetriever();
    
    // Search the Abstract namespace
    const documents = await retriever.getRelevantDocuments(query);

    console.log(`Found ${documents.length} results`);

    // Format the results
    const results = documents.map((doc) => ({
      id: doc.id || "", // Pinecone's internal ID
      score: 0, // Note: retriever doesn't return scores directly
      metadata: {
        id: doc.metadata.id,
        title: doc.metadata.title,
        link: doc.metadata.link,
        authors: doc.metadata.authors,
        level: doc.metadata.level,
        _line: doc.metadata._line,
        _source: doc.metadata._source,
      },
      pageContent: doc.pageContent,
    }));

    const response = {
      results,
      query,
      totalResults: results.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST method with query in body" });
}