import Breadcrumbs from '@/components/Breadcrumbs';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'New Post' },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Post</h1>
        <p className="text-muted-foreground">Write and publish a new article for your audience.</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
