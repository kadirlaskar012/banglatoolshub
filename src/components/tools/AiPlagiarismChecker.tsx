'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function AiPlagiarismChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCheck = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(interval);
                return 95;
            }
            return prev + 5;
        });
    }, 200);

    // Placeholder for actual API call
    setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        const randomOriginality = Math.floor(Math.random() * 31) + 70; // 70% to 100%
        setResult(`${randomOriginality}% মৌলিক।`);
        setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="আপনার বাংলা লেখাটি এখানে পেস্ট করুন..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] text-lg"
        disabled={isLoading}
      />
      <Button onClick={handleCheck} disabled={isLoading || !text.trim()}>
        {isLoading ? 'যাচাই করা হচ্ছে...' : 'মৌলিকতা যাচাই করুন'}
      </Button>

      {isLoading && (
        <div className="space-y-2 pt-4">
          <p className="text-center text-muted-foreground">আপনার লেখা বিশ্লেষণ করা হচ্ছে...</p>
          <Progress value={progress} />
        </div>
      )}

      {result && (
        <Card className="mt-4 border-primary">
          <CardHeader>
            <CardTitle>ফলাফল</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
