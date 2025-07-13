import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts, getBlogPostBySlug, getToolBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calendar, User, Wrench } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tool } from '@/lib/types';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
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
  if(post.relatedTools) {
    for (const slug of post.relatedTools) {
      const tool = await getToolBySlug(slug);
      relatedTools.push(tool);
    }
  }
  const validRelatedTools = relatedTools.filter(Boolean) as Tool[];

  return (
    <div className="max-w-4xl mx-auto">
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
        
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          className="my-8 rounded-lg object-cover aspect-video"
          priority
          data-ai-hint="technology abstract"
        />

        <div className="prose prose-lg max-w-none font-body prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80">
          {post.content}
        </div>
      </article>

      {validRelatedTools.length > 0 && (
          <aside className="mt-12">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <Wrench className="w-5 h-5 text-primary"/>
                        Related Tools
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
      )}
    </div>
  );
}
