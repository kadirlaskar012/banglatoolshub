import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts, getBlogPostBySlug, getToolBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calendar, User, Wrench, List, HelpCircle, BookText, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost, Tool } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';
import GiscusComments from '@/components/GiscusComments';

type BlogPostPageProps = {
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

const BlogSchemaMarkup = ({ post }: { post: BlogPost }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Bangla Tools HUB',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
      headline: post.title,
      description: post.excerpt,
      image: post.imageUrl,
      author: {
        '@type': 'Organization',
        name: post.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Bangla Tools HUB',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: post.publishedAt,
    };
  
    const faqSchema = post.faq && post.faq.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    } : null;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${baseUrl}/`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${baseUrl}/blog`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
            }
        ]
    };
  
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </>
    );
  };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedTools: (Tool | null)[] = [];
  if (post.relatedTools) {
    for (const slug of post.relatedTools) {
      const tool = await getToolBySlug(slug);
      relatedTools.push(tool);
    }
  }
  const validRelatedTools = relatedTools.filter(Boolean) as Tool[];
  const headings = getHeadings(post.contentHtml);

  return (
    <div className="max-w-4xl mx-auto">
      <BlogSchemaMarkup post={post} />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />
      <article className="mt-6">
        <h1 className="text-4xl lg:text-5xl font-bold font-headline leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedAt}>
              {format(parseISO(post.publishedAt), 'MMMM d, yyyy')}
            </time>
          </div>
        </div>
        
        {post.imageUrl && (
            <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="my-8 rounded-lg object-cover aspect-video"
            priority
            data-ai-hint="technology abstract"
            />
        )}

        {headings.length > 0 && (
          <Card className="my-8 bg-muted/50">
            <Accordion type="single" collapsible defaultValue="toc">
              <AccordionItem value="toc" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5 text-primary"/>
                    সূচিপত্র (Table of Contents)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ul className="space-y-2 text-base list-decimal list-inside text-primary">
                    {headings.map(heading => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="font-medium text-foreground hover:underline hover:text-primary">
                              {heading.text}
                          </a>
                        </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        <div 
            className="prose prose-lg max-w-none font-body prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

      </article>

      {post.faq && post.faq.length > 0 && (
        <>
          <Separator className='my-12' />
          <section>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3 font-headline text-xl">
                          <HelpCircle className="w-5 h-5 text-primary"/>
                          সাধারণ প্রশ্ন ও উত্তর (FAQ)
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                          {post.faq.map((item, index) => (
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
          </section>
        </>
      )}

      {validRelatedTools.length > 0 && (
        <>
          <Separator className='my-12' />
          <aside>
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <Wrench className="w-5 h-5 text-primary"/>
                        সম্পর্কিত টুলস
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {validRelatedTools.map(tool => tool && (
                            <li key={tool.id}>
                                <Link href={`/tools/${tool.slug}`} className="font-semibold text-primary hover:underline">
                                    {tool.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </aside>
        </>
      )}

      <Separator className='my-12' />
      <section>
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3 mb-4">
            <MessageSquare className="w-7 h-7 text-primary"/>
            আপনার মতামত দিন
        </h2>
        <GiscusComments />
      </section>

    </div>
  );
}
