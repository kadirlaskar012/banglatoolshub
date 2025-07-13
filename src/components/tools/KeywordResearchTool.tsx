'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function KeywordResearchTool() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    setResults([]);

    // Placeholder for actual API call
    setTimeout(() => {
      const sampleResults = [
        { keyword: `${keyword}`, volume: Math.floor(Math.random() * 5000), cpc: (Math.random() * 0.5).toFixed(2) },
        { keyword: `সেরা ${keyword}`, volume: Math.floor(Math.random() * 2000), cpc: (Math.random() * 0.4).toFixed(2) },
        { keyword: `${keyword} দাম`, volume: Math.floor(Math.random() * 3000), cpc: (Math.random() * 0.6).toFixed(2) },
        { keyword: `অনলাইন ${keyword}`, volume: Math.floor(Math.random() * 1500), cpc: (Math.random() * 0.3).toFixed(2) },
        { keyword: `বাংলায় ${keyword}`, volume: Math.floor(Math.random() * 1000), cpc: (Math.random() * 0.2).toFixed(2) },
      ];
      setResults(sampleResults);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="একটি কীওয়ার্ড লিখুন..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleSearch} disabled={isLoading || !keyword.trim()}>
          {isLoading ? 'অনুসন্ধান...' : 'অনুসন্ধান'}
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>কীওয়ার্ড</TableHead>
                <TableHead className="text-right">সার্চ ভলিউম (মাসিক)</TableHead>
                <TableHead className="text-right">CPC (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((res, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{res.keyword}</TableCell>
                  <TableCell className="text-right">{res.volume.toLocaleString('bn-BD')}</TableCell>
                  <TableCell className="text-right">${res.cpc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
