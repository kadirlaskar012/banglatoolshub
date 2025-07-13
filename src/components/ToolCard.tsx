import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Tool } from '@/lib/types';
import { iconMap } from './icons';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || null;
  return (
    <Link href={`/tools/${tool.slug}`} className="block group">
      <Card className="flex flex-col items-center text-center p-6 h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-primary/50">
        <CardHeader className="p-0">
          {Icon && (
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="w-10 h-10" />
              </div>
          )}
          <CardTitle className="font-headline text-xl">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2 flex-grow">
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
