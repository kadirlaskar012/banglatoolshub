
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Terminal, XCircle, Clock } from 'lucide-react';
import { checkPlagiarism, type PlagiarismResult as ApiPlagiarismResult } from '@/ai/flows/plagiarism-checker-flow';
import { cn } from '@/lib/utils';

interface HighlightedSentence {
  text: string;
  isDuplicate: boolean;
}

interface PlagiarismResult {
    highlightedContent: HighlightedSentence[];
    uniquePercentage: number;
    duplicatePercentage: number;
}

const DAILY_LIMIT = 2;
const WORD_LIMIT = 250;

const getApiUsage = (): { count: number; date: string } => {
  if (typeof window === 'undefined') return { count: 0, date: '' };
  const storedUsage = localStorage.getItem('apiPlagiarismUsage');
  if (storedUsage) {
    return JSON.parse(storedUsage);
  }
  return { count: 0, date: new Date().toISOString().split('T')[0] };
};

const updateApiUsage = () => {
  if (typeof window === 'undefined') return;
  const usage = getApiUsage();
  const today = new Date().toISOString().split('T')[0];
  if (usage.date === today) {
    usage.count += 1;
  } else {
    usage.count = 1;
    usage.date = today;
  }
  localStorage.setItem('apiPlagiarismUsage', JSON.stringify(usage));
};


export default function AiPlagiarismChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiMode, setIsApiMode] = useState(false);
  const { toast } = useToast();

  const [remainingChecks, setRemainingChecks] = useState(DAILY_LIMIT);
  const [cooldown, setCooldown] = useState('');

  const wordCount = useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  const isWordLimitExceeded = useMemo(() => {
      return isApiMode && wordCount > WORD_LIMIT;
  }, [isApiMode, wordCount]);

  const updateRemainingChecks = () => {
    const usage = getApiUsage();
    const today = new Date().toISOString().split('T')[0];
    if (usage.date === today) {
        setRemainingChecks(Math.max(0, DAILY_LIMIT - usage.count));
    } else {
        setRemainingChecks(DAILY_LIMIT);
    }
  };

  useEffect(() => {
    updateRemainingChecks();

    const intervalId = setInterval(() => {
        const usage = getApiUsage();
        const today = new Date().toISOString().split('T')[0];
        if (usage.date === today && usage.count >= DAILY_LIMIT) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();
            
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setCooldown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        } else {
            setCooldown('');
            updateRemainingChecks();
        }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
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

  const handleApiCheck = async (inputText: string) => {
    if (remainingChecks <= 0) {
      toast({
        title: "দৈনিক সীমা শেষ",
        description: "আপনি আজকের জন্য অনলাইন যাচাইয়ের সীমা শেষ করেছেন। অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
        const apiResult: ApiPlagiarismResult = await checkPlagiarism({ text: inputText });
        updateApiUsage();
        updateRemainingChecks();

        const transformedResult: PlagiarismResult = {
            highlightedContent: apiResult.sentences.map(s => ({ text: s.text, isDuplicate: s.isPlagiarized })),
            uniquePercentage: apiResult.uniquePercentage,
            duplicatePercentage: apiResult.plagiarizedPercentage,
        };
        setResult(transformedResult);

    } catch (error) {
        console.error("API plagiarism check failed:", error);
        toast({
            title: "একটি সমস্যা হয়েছে",
            description: "অনলাইন যাচাই করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
            variant: "destructive",
        });
    }
  }

  const handleCheck = async () => {
    if (text.trim().length < 20) {
        toast({
            title: "ত্রুটি",
            description: "অনুগ্রহ করে যাচাই করার জন্য যথেষ্ট লেখা দিন (কমপক্ষে ২০ অক্ষর)।",
            variant: "destructive",
        });
        return;
    }

    if (isWordLimitExceeded) {
        toast({
            title: "শব্দসীমা অতিক্রম করেছে",
            description: `অনলাইন মোডে সর্বোচ্চ ${WORD_LIMIT} টি শব্দ ব্যবহার করা যাবে।`,
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    setResult(null);

    if (isApiMode) {
        await handleApiCheck(text);
    } else {
        setTimeout(() => {
          const checkResult = handleOfflineCheck(text);
          setResult(checkResult);
          setIsLoading(false);
        }, 500);
    }
    
    if (isApiMode) {
      setIsLoading(false);
    }
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
            <AlertTitle>অনলাইন মোড (AI Powered)</AlertTitle>
            <AlertDescription>
              এই মোডটি শক্তিশালী Gemini AI ব্যবহার করে আপনার লেখার মৌলিকতা ইন্টারনেটের সাথে তুলনা করে। 
              {cooldown ? (
                <span className="text-destructive font-semibold flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4"/>
                    পরবর্তী চেষ্টা: {cooldown}
                </span>
              ) : (
                <span className="text-primary font-semibold block mt-2">
                    আজকের জন্য বাকি আছে: {remainingChecks.toLocaleString('bn-BD')} বার
                </span>
              )}
            </AlertDescription>
          </Alert>
       )}

      <div>
        <Textarea
            placeholder="আপনার বাংলা লেখাটি এখানে পেস্ট করুন..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[250px] text-base"
            disabled={isLoading}
        />
        <div className="text-sm text-muted-foreground mt-2 flex justify-between">
            <span>
                {isApiMode && isWordLimitExceeded && (
                    <span className="text-destructive font-semibold">
                        শব্দসীমা অতিক্রম করেছে!
                    </span>
                )}
            </span>
            <span className={cn(isWordLimitExceeded && "text-destructive font-semibold")}>
                শব্দ সংখ্যা: {wordCount.toLocaleString('bn-BD')} {isApiMode && `/ ${WORD_LIMIT.toLocaleString('bn-BD')}`}
            </span>
        </div>
      </div>

      <Button onClick={handleCheck} disabled={isLoading || !text.trim() || (isApiMode && (remainingChecks <= 0 || isWordLimitExceeded))} className="w-full md:w-auto text-lg py-6">
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
                            <p className="text-sm text-muted-foreground">{isApiMode ? 'সম্ভাব্য প্লেজিয়ারিজম' : 'পুনরাবৃত্তির হার'}</p>
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
