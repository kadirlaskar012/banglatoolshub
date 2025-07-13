
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
import { BookText, List, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const ToolSchemaMarkup = ({ tool }: { tool: Tool }) => {
    const softwareSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.longDescription,
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BDT',
      },
    };
  
    const faqSchema = tool.faq && tool.faq.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    } : null;
  
    // Generic HowTo schema, can be customized per tool later if needed
    const howToSteps = [
        {
            "@type": "HowToStep",
            "name": "ধাপ ১: তথ্য ইনপুট করুন",
            "text": "টুলের প্রয়োজনীয় ইনপুট ফিল্ডে আপনার ডেটা বা তথ্য লিখুন। যেমন, বয়স ক্যালকুলেটরের জন্য জন্ম তারিখ দিন।",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${tool.slug}#tool-interface`
        },
        {
            "@type": "HowToStep",
            "name": "ধাপ ২: গণনা/রূপান্তর করুন",
            "text": "মূল বাটনে (যেমন 'গণনা করুন' বা 'রূপান্তর করুন') ক্লিক করে প্রক্রিয়া শুরু করুন।",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${tool.slug}#tool-interface`
        },
        {
            "@type": "HowToStep",
            "name": "ধাপ ৩: ফলাফল দেখুন",
            "text": "স্ক্রিনে প্রদর্শিত ফলাফল দেখুন। প্রয়োজনে ফলাফল কপি বা শেয়ার করুন।",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tools/${tool.slug}#tool-interface`
        }
    ];

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `কীভাবে ${tool.name} ব্যবহার করবেন`,
        "description": `${tool.name} ব্যবহার করে কীভাবে সহজে আপনার কাজ সম্পন্ন করবেন তার ধাপসমূহ।`,
        "step": howToSteps
    };
  
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </>
    );
  };

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
      <ToolSchemaMarkup tool={tool} />
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
            <Card id="tool-interface">
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
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    {tool.name} সম্পর্কে বিস্তারিত
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none font-body prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: tool.contentHtml }}
                />
              </CardContent>
            </Card>

            {tool.faq && tool.faq.length > 0 && (
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3 font-headline text-xl">
                          <HelpCircle className="w-5 h-5 text-primary"/>
                          সাধারণ প্রশ্ন ও উত্তর (FAQ)
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                          {tool.faq.map((item, index) => (
                              <AccordionItem value={`item-${index}`} key={index}>
                                  <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                                  <AccordionContent className="prose prose-lg max-w-none font-body">
                                      <p>{item.answer}</p>
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                  </CardContent>
              </Card>
            )}

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

    