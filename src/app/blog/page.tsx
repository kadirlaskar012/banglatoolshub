import { getBlogPosts } from '@/lib/data';
import PostCard from '@/components/PostCard';

export const metadata = {
  title: 'Blog | Bangla Tools HUB',
  description: 'Articles, tutorials, and updates from the Bangla Tools HUB team.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Our Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Insights, tutorials, and news from our team.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
