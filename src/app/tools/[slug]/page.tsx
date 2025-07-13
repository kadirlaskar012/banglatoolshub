import { notFound } from 'next/navigation';
import { getTools, getToolBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import AiToolSuggester from '@/components/AiToolSuggester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { iconMap } from '@/components/icons';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import all tool components
const ToolComponents: { [key: string]: React.ComponentType<any> } = {
  'ai-plagiarism-checker': dynamic(() => import('@/components/tools/AiPlagiarismChecker'), { loading: () => <ToolSkeleton /> }),
  'legal-document-summarizer': dynamic(() => import('@/components/tools/LegalDocumentSummarizer'), { loading: () => <ToolSkeleton /> }),
  'loan-emi-calculator': dynamic(() => import('@/components/tools/LoanEmiCalculator'), { loading: () => <ToolSkeleton /> }),
  'keyword-research-tool': dynamic(() => import('@/components/tools/KeywordResearchTool'), { loading: () => <ToolSkeleton /> }),
  'online-cv-resume-builder': dynamic(() => import('@/components/tools/OnlineCvResumeBuilder'), { loading: () => <ToolSkeleton /> }),
  'investment-return-calculator': dynamic(() => import('@/components/tools/InvestmentReturnCalculator'), { loading: () => <ToolSkeleton /> }),
  'age-calculator': dynamic(() => import('@/components/tools/AgeCalculator'), { loading: () => <ToolSkeleton /> }),
  'image-to-text-ocr-converter': dynamic(() => import('@/components/tools/ImageToTextOcrConverter'), { loading: () => <ToolSkeleton /> }),
  'video-to-mp3-converter': dynamic(() => import('@/components/tools/VideoToMp3Converter'), { loading: () => <ToolSkeleton /> }),
  'gst-vat-calculator': dynamic(() => import('@/components/tools/GstVatCalculator'), { loading: () => <ToolSkeleton /> }),
};

const ToolSkeleton = () => (
    <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
        <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-1/4 mx-auto" />
  </div>
)

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.metaTitle || `${tool.name} | Bangla Tools HUB`,
    description: tool.metaDescription || tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const Icon = iconMap[tool.icon as keyof typeof iconMap] || null;
  const ToolComponent = ToolComponents[tool.slug] || null;

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'হোম', href: '/' },
          { label: 'টুলস', href: '/tools' },
          { label: tool.name },
        ]}
      />
      <div className="mt-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-4 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-8 h-8" />
            </div>
          )}
          <h1 className="text-4xl font-bold font-headline">{tool.name}</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">{tool.longDescription}</p>
      </div>
      
      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline text-2xl'>টুলটি ব্যবহার করুন</CardTitle>
                </CardHeader>
                <CardContent>
                    {ToolComponent ? <ToolComponent /> : (
                        <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
                            টুল ইন্টারফেস লোড হচ্ছে...
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <AiToolSuggester content={tool.contentHtml} />
        </div>
      </div>
    </div>
  );
}
