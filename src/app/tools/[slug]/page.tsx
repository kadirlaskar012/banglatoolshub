import { notFound } from 'next/navigation';
import { getTools, getToolBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import AiToolSuggester from '@/components/AiToolSuggester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const tools = getTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.name} | Bangla Tools HUB`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const Icon = tool.icon;

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name },
        ]}
      />
      <div className="mt-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold font-headline">{tool.name}</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">{tool.longDescription}</p>
      </div>
      
      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline text-2xl'>Use the Tool</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-lg max-w-none font-body">
                        {/* Placeholder for the actual tool implementation */}
                        <p>The interactive component for the {tool.name} would be displayed here.</p>
                        <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
                            Tool Interface Area
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <AiToolSuggester content={tool.content} />
        </div>
      </div>
    </div>
  );
}
