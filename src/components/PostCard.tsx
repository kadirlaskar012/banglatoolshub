import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/lib/types';
import { Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint="technology abstract"
        />
      </Link>
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
            {format(parseISO(post.publishedAt), 'MMMM d, yyyy')}
            </time>
        </div>
      </CardFooter>
    </Card>
  );
}
