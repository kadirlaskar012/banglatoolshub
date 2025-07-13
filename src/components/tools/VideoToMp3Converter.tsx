'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function VideoToMp3Converter() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setDownloadLink('');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    // Placeholder for actual API call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setDownloadLink('#'); // Placeholder link
      setIsLoading(false);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-xl mx-auto">
      <p className="text-muted-foreground">ইউটিউব বা অন্য কোনো ভিডিওর লিঙ্ক পেস্ট করুন</p>
      <div className="flex w-full gap-2">
        <Input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-lg"
          disabled={isLoading}
        />
        <Button onClick={handleConvert} disabled={isLoading || !url.trim()}>
          {isLoading ? 'রূপান্তর...' : 'রূপান্তর'}
        </Button>
      </div>
      
      {isLoading && (
        <div className="w-full pt-4 space-y-2">
            <p className="text-center">ভিডিও প্রসেস করা হচ্ছে...</p>
            <Progress value={progress} />
        </div>
      )}
      
      {downloadLink && (
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={downloadLink} download>
              <Download className="mr-2 h-5 w-5" />
              MP3 ডাউনলোড করুন
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
