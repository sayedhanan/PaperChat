'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, ExternalLink } from "lucide-react";


import Hero from "@/components/home/hero";

export default function SearchInterface() {
  // State management
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();

  // Function to handle paper selection
  const handlePaperClick = (paperId) => {
    router.push(`/paper/${paperId}`);
  };

  // Function to handle the search
  const handleSearch = async () => {
    if (!query.trim()) return; // Don't search empty queries
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero */}
      <Hero />
      {/* End Hero */}
        
      
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for research papers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Results Section - We'll build this next */}
      <div className="space-y-4">
        {results.length > 0 && (
          <div className="text-sm text-gray-600 mb-4">
            Found {results.length} papers
          </div>
        )}
        
        {/* Results Cards */}
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
            onClick={() => handlePaperClick(result.metadata.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg leading-tight flex items-start justify-between">
                <span className="flex-1 pr-2">{result.metadata.title}</span>
                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
              </CardTitle>
              <div className="text-sm text-gray-600">
                <strong>Authors:</strong> {result.metadata.authors}
              </div>
              {result.metadata.level && (
                <div className="text-xs text-gray-500">
                  PDF: {result.metadata.level}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm line-clamp-3">
                {result.pageContent}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}