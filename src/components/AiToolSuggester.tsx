'use client';

import { useState, useEffect } from 'react';
import { getToolSuggestions } from '@/app/tools/[slug]/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/data';
import type { Tool } from '@/lib/types';

interface AiToolSuggesterProps {
  content: string;
}

export default function AiToolSuggester({ content }: AiToolSuggesterProps) {
  const [suggestions, setSuggestions] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const result = await getToolSuggestions(content);
        
        const suggestedTools: Tool[] = [];
        for (const slugOrName of result) {
            const tool = await getToolBySlug(slugOrName);
            if (tool) {
                suggestedTools.push(tool);
            }
        }
        setSuggestions(suggestedTools.slice(0, 3)); // Limit to 3 suggestions

      } catch (error) {
        console.error('Failed to fetch AI suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [content]);

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            <CardTitle className="font-headline text-xl">AI Suggestions</CardTitle>
        </div>
        <CardDescription>Related tools you might find useful.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside">
            {suggestions.map((tool, index) => (
              <li key={index}>
                <Link href={`/tools/${tool.slug}`} className="font-medium text-primary hover:underline">
                    {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No suggestions found.</p>
        )}
      </CardContent>
    </Card>
  );
}
