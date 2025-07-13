import { notFound } from 'next/navigation';
import { getTools, getToolBySlug, getBlogPosts } from '@/lib/data';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import AiToolSuggester from '@/components/AiToolSuggester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { iconMap } from '@/components/icons';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost, Tool } from '@/lib/types';
import PostCard from '@/components/PostCard';
import { BookText, List } from 'lucide-react';

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

// Function to extract headings from HTML content
const getHeadings = (htmlContent: string) => {
    const headingRegex = /<h2 id="([^"]+)">(.*?)<\/h2>/g;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(htmlContent)) !== null) {
        headings.push({ id: match[1], text: match[2].replace(/<[^>]*>?/gm, '') });
    }
    return headings;
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

  const allPosts = await getBlogPosts();
  // Find blog posts that are related to this tool
  const relatedPosts = allPosts.filter(post => 
    post.relatedTools && post.relatedTools.includes(tool.slug)
  );
  
  const headings = getHeadings(tool.contentHtml);

  const Icon = iconMap[tool.icon as keyof typeof iconMap] || null;
  const ToolComponent = ToolComponents[tool.slug] || null;

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name },
        ]}
      />
      <header className="mt-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-4 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-8 h-8" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold font-headline">{tool.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{tool.longDescription}</p>
          </div>
        </div>
      </header>
      
      <Separator className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <main className="lg:col-span-2 space-y-8">
            <Card>
                <CardContent className="p-6">
                    {ToolComponent ? <ToolComponent /> : (
                        <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
                            টুল ইন্টারফেস লোড হচ্ছে...
                        </div>
                    )}
                </CardContent>
            </Card>

            {headings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline text-xl">
                            <List className="w-5 h-5 text-primary"/>
                            সূচিপত্র (Table of Contents)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-decimal list-inside text-primary">
                            {headings.map(heading => (
                                <li key={heading.id}>
                                    <a href={`#${heading.id}`} className="hover:underline font-medium">
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div 
                  className="prose prose-lg max-w-none font-body prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: tool.contentHtml }}
                />
              </CardContent>
            </Card>

        </main>
        <aside className="lg:col-span-1">
          <AiToolSuggester content={tool.contentHtml} />
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <Separator className="my-8" />
          <div className="text-center">
            <h2 className="text-3xl font-bold font-headline flex items-center justify-center gap-3">
              <BookText className="w-8 h-8 text-primary"/>
              সম্পর্কিত ব্লগ পোস্ট
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              এই টুলটি সম্পর্কে আরও জানতে পড়ুন।
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
