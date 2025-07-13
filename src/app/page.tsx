import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTools, getBlogPosts } from '@/lib/data';
import ToolCard from '@/components/ToolCard';
import PostCard from '@/components/PostCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredTools = getTools().slice(0, 3);
  const latestPosts = getBlogPosts().slice(0, 2);

  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground">
          Bangla Tools HUB
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body">
          Your one-stop destination for essential utilities, converters, and
          creative tools tailored for the Bengali language.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/tools">
              Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/blog">Read our Blog</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-8">
          Featured Tools
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
                Why Choose Us?
            </h2>
            <p className="text-muted-foreground">
                We provide a curated collection of high-quality tools designed to be simple, efficient, and accessible for everyone.
            </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">AI-Powered Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Our smart assistant suggests relevant tools to streamline your workflow.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Mobile Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Access all our tools on the go, with a design that adapts to any screen size.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-8">
          From the Blog
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
