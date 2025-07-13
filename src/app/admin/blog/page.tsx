import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBlogPosts } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default async function AdminBlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Manage Blog Posts</h1>
                    <p className="text-muted-foreground">Here you can create, edit, and publish articles.</p>
                </div>
                 <Button asChild>
                    <Link href="/admin/blog/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Published Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map(post => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>{post.author}</TableCell>
                                <TableCell>{post.publishedAt ? format(parseISO(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</TableCell>
                                <TableCell className="text-right">
                                  {/* Edit/Delete buttons will be added later */}
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
