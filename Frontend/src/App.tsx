import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [review, setReview] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setSentiment(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setSentiment("Error");
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = () => {
    if (sentiment === "Positive") {
      return (
        <Badge className="text-lg px-6 py-3 gap-2 bg-green-100 text-green-800 hover:bg-green-200">
          <ThumbsUp className="w-5 h-5" />
          Positive Review
        </Badge>
      );
    } else if (sentiment === "Negative") {
      return (
        <Badge className="text-lg px-6 py-3 gap-2 bg-red-100 text-red-800 hover:bg-red-200">
          <ThumbsDown className="w-5 h-5" />
          Negative Review
        </Badge>
      );
    } else if (sentiment === "Error") {
      return (
        <Badge className="text-lg px-6 py-3 gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          ⚠️ Error analyzing review
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center justify-center w-full">
          <Card className="w-full max-w-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Sentiment Analyzer
                </span>
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Analyze the sentiment of your movie review
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Write your movie review here..."
                  rows={5}
                  className="resize-none text-lg"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {review.length} characters
                </div>
              </div>

              <Button
                onClick={handlePredict}
                disabled={loading || !review.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Sentiment"
                )}
              </Button>

              <AnimatePresence>
                {sentiment && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 text-center space-y-4"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">Analysis Result</h2>
                    <div className="flex justify-center">
                      {renderBadge()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
