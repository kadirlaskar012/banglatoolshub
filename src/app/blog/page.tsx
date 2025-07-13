import { getBlogPosts } from '@/lib/data';
import PostCard from '@/components/PostCard';

export const metadata = {
  title: 'ব্লগ | বাংলা টুলস হাব',
  description: 'বাংলা টুলস হাব টিমের লেখা বিভিন্ন আর্টিকেল, টিউটোরিয়াল এবং আপডেট।',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">আমাদের ব্লগ</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          আমাদের টিমের পক্ষ থেকে বিভিন্ন টিপস, টিউটোরিয়াল এবং খবর।
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
