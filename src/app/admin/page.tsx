import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the admin panel. Here you can manage your tools and blog posts.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Manage Tools</CardTitle>
            <CardDescription>
              Add, edit, or remove tools from your site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/tools">Go to Tools</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Manage Blog</CardTitle>
            <CardDescription>
              Create and publish new blog posts and articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/blog">Go to Blog</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
