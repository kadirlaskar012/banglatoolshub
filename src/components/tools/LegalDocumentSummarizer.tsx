'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

export default function LegalDocumentSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setSummary('');

    // Placeholder for actual API call
    setTimeout(() => {
      setSummary("এটি একটি স্যাম্পেল সারসংক্ষেপ। আসল এপিআই ব্যবহার করা হলে, এখানে আপনার প্রদান করা আইনি দলিলের একটি সহজ এবং সংক্ষিপ্ত সারসংক্ষেপ তৈরি করে দেখানো হবে।");
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="জটিল আইনি লেখাটি এখানে পেস্ট করুন..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[250px]"
        disabled={isLoading}
      />
      <Button onClick={handleSummarize} disabled={isLoading || !text.trim()}>
        <Wand2 className="mr-2 h-4 w-4" />
        {isLoading ? 'সারসংক্ষেপ তৈরি হচ্ছে...' : 'সারসংক্ষেপ তৈরি করুন'}
      </Button>

      {summary && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>সহজ সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
