'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">অনুসন্ধান করুন</CardTitle>
        <CardDescription>টুলস বা ব্লগ পোস্ট খুঁজুন</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="এখানে লিখুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
