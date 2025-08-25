'use client';
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function ChatInterface({ paperId, paperTitle, paperAuthors, paperAbstract }) {
  // read id from URL params (App Router)
  const params = useParams();
  const currentPaperId = parseFloat(params?.id) ?? paperId; // prefer URL id, fallback to props
  console.log(typeof currentPaperId)

  // State management
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle asking a question
  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: currentQuestion,
          paperId: currentPaperId // send URL id
        }),
      });
      
      const data = await response.json();
      setCurrentAnswer(data.answer);
      
    } catch (error) {
      console.error('Ask API error:', error);
      setCurrentAnswer("Sorry, I couldn't process your question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
        <div className="text-sm text-gray-500">
          Paper ID: {currentPaperId}
        </div>
      </div>

      {/* Paper Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{paperTitle || "Selected Research Paper"}</CardTitle>
          {paperAuthors && (
            <p className="text-sm text-gray-600">
              <strong>Authors:</strong> {paperAuthors}
            </p>
          )}
        </CardHeader>
        {paperAbstract && (
          <CardContent>
            <p className="text-sm text-gray-700">{paperAbstract}</p>
          </CardContent>
        )}
      </Card>

      {/* Q&A Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask a Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Ask anything about this paper - methodology, results, conclusions, etc.
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="What is the main contribution of this paper?"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full"
              />
              
              <Button 
                onClick={handleAskQuestion}
                disabled={isLoading || !currentQuestion.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ask Question
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Answer</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Analyzing the paper...</p>
                </div>
              </div>
            ) : currentAnswer ? (
              <div className="prose max-w-none">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {currentAnswer}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Your answer will appear here</p>
                <p className="text-sm mt-2">Ask a question about the paper to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
