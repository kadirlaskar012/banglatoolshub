import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTools, getBlogPosts } from '@/lib/data';
import ToolCard from '@/components/ToolCard';
import PostCard from '@/components/PostCard';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const allTools = await getTools();
  const allPosts = await getBlogPosts();
  
  const featuredTools = allTools.slice(0, 3);
  const latestPosts = allPosts.slice(0, 2);

  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground">
          বাংলা টুলস হাব
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body">
          বাংলা ভাষার জন্য তৈরি বিভিন্ন ইউটিলিটি, কনভার্টার এবং ক্রিয়েটিভ টুলের সেরা ঠিকানা।
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/tools">
              সব টুল দেখুন <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/blog">আমাদের ব্লগ পড়ুন</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-8">
          জনপ্রিয় টুলস
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-headline font-bold">
                কেন আমরা সেরা?
            </h2>
            <p className="text-muted-foreground">
                আমরা এমন কিছু বাছাই করা টুল সরবরাহ করি যা সহজ, কার্যকর এবং সকলের জন্য ব্যবহারযোগ্য।
            </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">এআই-চালিত ফিচার</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">আমাদের স্মার্ট টুলগুলো আপনার কর্মপ্রবাহকে আরও গতিশীল করতে সাহায্য করে।</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">মোবাইল-ফ্রেন্ডলি ডিজাইন</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">যেকোনো ডিভাইস থেকে আমাদের সমস্ত টুল স্বাচ্ছন্দ্যে ব্যবহার করুন।</p>
                </CardContent>
            </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-8">
          ব্লগ থেকে পড়ুন
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
