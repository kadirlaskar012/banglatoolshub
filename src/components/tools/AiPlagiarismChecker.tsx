
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HighlightedSentence {
  text: string;
  isDuplicate: boolean;
}

// Placeholder for future API integration
const checkPlagiarismWithApi = async (text: string) => {
  console.log("API Mode is not implemented yet.");
  // In the future, you would make an API call here.
  // For now, it returns no duplicates.
  return new Promise<HighlightedSentence[]>((resolve) => {
    setTimeout(() => {
      resolve([{ text, isDuplicate: false }]);
    }, 2000);
  });
};


export default function AiPlagiarismChecker() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<HighlightedSentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiMode] = useState(false); // Toggle for future API mode

  const handleOfflineCheck = (inputText: string) => {
    if (!inputText.trim()) {
        setResults([]);
        return;
    }

    // Split text into sentences by period, question mark, exclamation mark, or newline
    const sentences = inputText.split(/(?<=[.?!।\n])\s*/).filter(s => s.trim().length > 0);
    const sentenceCounts: { [key: string]: number } = {};

    // Count occurrences of each sentence (case-insensitive and trimmed)
    sentences.forEach(sentence => {
      const cleanedSentence = sentence.trim().toLowerCase();
      if (cleanedSentence) {
        sentenceCounts[cleanedSentence] = (sentenceCounts[cleanedSentence] || 0) + 1;
      }
    });
    
    // Map sentences to results with duplication flag
    const highlightedSentences = sentences.map(sentence => {
      const cleanedSentence = sentence.trim().toLowerCase();
      return {
        text: sentence,
        isDuplicate: cleanedSentence ? sentenceCounts[cleanedSentence] > 1 : false,
      };
    });

    setResults(highlightedSentences);
  };

  const handleCheck = async () => {
    setIsLoading(true);
    setResults([]);

    if (isApiMode) {
      // Future implementation
      const apiResults = await checkPlagiarismWithApi(text);
      setResults(apiResults);
    } else {
      // Offline check logic
      handleOfflineCheck(text);
    }

    setIsLoading(false);
  };

  const hasDuplicates = results.some(r => r.isDuplicate);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">আপনার লেখাটি দিন</h3>
        <Badge variant="outline">Offline Mode Active</Badge>
      </div>
      <Textarea
        placeholder="আপনার বাংলা লেখাটি এখানে পেস্ট করুন..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] text-base"
        disabled={isLoading}
      />
      <Button onClick={handleCheck} disabled={isLoading || !text.trim()} className="w-full md:w-auto">
        {isLoading ? 'যাচাই করা হচ্ছে...' : 'মৌলিকতা যাচাই করুন'}
      </Button>

      {results.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>বিশ্লেষণের ফলাফল</CardTitle>
            <CardDescription>
                {hasDuplicates ? "আপনার লেখায় পুনরাবৃত্তিমূলক বাক্য পাওয়া গেছে (লাল চিহ্নিত)।" : "আপনার লেখায় কোনো পুনরাবৃত্তিমূলক বাক্য পাওয়া যায়নি।"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none rounded-md border bg-secondary/20 p-4 max-h-96 overflow-y-auto">
              <p>
                {results.map((sentence, index) => (
                  <span
                    key={index}
                    className={sentence.isDuplicate ? 'bg-red-200 dark:bg-red-800/50 rounded' : ''}
                  >
                    {sentence.text}
                  </span>
                ))}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    