
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Terminal, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HighlightedSentence {
  text: string;
  isDuplicate: boolean;
}

interface PlagiarismResult {
    highlightedContent: HighlightedSentence[];
    uniquePercentage: number;
    duplicatePercentage: number;
}

// Placeholder for future API integration
const checkPlagiarismWithApi = async (text: string): Promise<PlagiarismResult> => {
  console.log("API Mode is not implemented yet.");
  // In the future, you would make an API call here.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        highlightedContent: [{ text, isDuplicate: false }],
        uniquePercentage: 100,
        duplicatePercentage: 0,
      });
    }, 2000);
  });
};


export default function AiPlagiarismChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiMode, setIsApiMode] = useState(false);
  const { toast } = useToast();

  const handleOfflineCheck = (inputText: string): PlagiarismResult | null => {
    if (!inputText.trim()) {
        return null;
    }

    const sentences = inputText.split(/(?<=[.?!।\n])\s*/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return null;

    const sentenceCounts: { [key: string]: number } = {};
    const cleanedSentences = sentences.map(s => s.trim().toLowerCase());

    cleanedSentences.forEach(cleanedSentence => {
      if (cleanedSentence) {
        sentenceCounts[cleanedSentence] = (sentenceCounts[cleanedSentence] || 0) + 1;
      }
    });
    
    const highlightedContent = sentences.map(sentence => {
      const cleanedSentence = sentence.trim().toLowerCase();
      return {
        text: sentence,
        isDuplicate: cleanedSentence ? sentenceCounts[cleanedSentence] > 1 : false,
      };
    });

    const duplicateSentenceCount = Object.values(sentenceCounts).filter(count => count > 1).length;
    const totalSentences = Object.keys(sentenceCounts).length;
    
    const duplicatePercentage = totalSentences > 0 ? Math.round((duplicateSentenceCount / totalSentences) * 100) : 0;
    const uniquePercentage = 100 - duplicatePercentage;

    return {
        highlightedContent,
        uniquePercentage,
        duplicatePercentage,
    };
  };

  const handleCheck = async () => {
    if (text.trim().length < 10) {
        toast({
            title: "ত্রুটি",
            description: "অনুগ্রহ করে যাচাই করার জন্য যথেষ্ট লেখা দিন।",
            variant: "destructive",
        });
        return;
    }

    if (isApiMode) {
      toast({
        title: "শীঘ্রই আসছে!",
        description: "অনলাইন মোড বর্তমানে উপলব্ধ নয়। আমরা এটি নিয়ে কাজ করছি।",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Offline check logic
    setTimeout(() => {
      const checkResult = handleOfflineCheck(text);
      setResult(checkResult);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="font-semibold text-lg">আপনার লেখাটি দিন</h3>
        <div className="flex items-center gap-2 p-1 rounded-full border bg-muted w-fit">
            <Button size="sm" variant={!isApiMode ? 'default' : 'ghost'} onClick={() => setIsApiMode(false)} className="rounded-full">অফলাইন মোড</Button>
            <Button size="sm" variant={isApiMode ? 'default' : 'ghost'} onClick={() => setIsApiMode(true)} className="rounded-full">অনলাইন মোড</Button>
        </div>
      </div>

       {isApiMode && (
         <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>অনলাইন মোড</AlertTitle>
            <AlertDescription>
              এই ফিচারটি শীঘ্রই আসছে। এটি আরও শক্তিশালী এবং গভীর বিশ্লেষণের জন্য একটি বহিরাগত API ব্যবহার করবে।
            </AlertDescription>
          </Alert>
       )}

      <Textarea
        placeholder="আপনার বাংলা লেখাটি এখানে পেস্ট করুন..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[250px] text-base"
        disabled={isLoading}
      />
      <Button onClick={handleCheck} disabled={isLoading || !text.trim()} className="w-full md:w-auto text-lg py-6">
        {isLoading ? 'যাচাই করা হচ্ছে...' : 'মৌলিকতা যাচাই করুন'}
      </Button>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>বিশ্লেষণের ফলাফল</CardTitle>
            <CardDescription>
                আপনার লেখার মৌলিকতা এবং পুনরাবৃত্তির হার নিচে দেওয়া হলো।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600"/>
                        <div>
                            <p className="text-sm text-muted-foreground">মৌলিকতার হার</p>
                            <p className="text-2xl font-bold">{result.uniquePercentage.toLocaleString('bn-BD')}%</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8 text-red-600"/>
                        <div>
                            <p className="text-sm text-muted-foreground">পুনরাবৃত্তির হার</p>
                            <p className="text-2xl font-bold">{result.duplicatePercentage.toLocaleString('bn-BD')}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="font-semibold mb-2">বিশ্লেষণমূলক লেখা:</h4>
                <div className="prose prose-lg max-w-none rounded-md border bg-secondary/20 p-4 max-h-96 overflow-y-auto">
                <p>
                    {result.highlightedContent.map((sentence, index) => (
                    <span
                        key={index}
                        className={sentence.isDuplicate ? 'bg-red-200 dark:bg-red-800/50 rounded' : ''}
                    >
                        {sentence.text}
                    </span>
                    ))}
                </p>
                </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
