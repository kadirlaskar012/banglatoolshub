import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { iconMap } from './icons';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || null;
  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        {Icon && (
            <div className="p-3 rounded-md bg-primary/10 text-primary">
                <Icon className="w-6 h-6" />
            </div>
        )}
        <CardTitle className="font-headline text-xl">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardDescription className="flex-grow">{tool.description}</CardDescription>
        <Button asChild variant="ghost" className="mt-4 self-start p-0 h-auto text-primary hover:text-primary">
          <Link href={`/tools/${tool.slug}`}>
            Use Tool <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
