'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addBlogPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '../ui/separator';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Publishing...' : 'Publish Post'}
        </Button>
    );
}

export function BlogPostForm() {

    return (
        <form action={addBlogPost}>
            <Card>
                <CardHeader>
                    <CardTitle>Blog Post Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Your post title" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" placeholder="your-post-title" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" name="excerpt" placeholder="A short summary of the post" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" placeholder="Write your full blog post here. Markdown is supported." rows={10} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" name="author" placeholder="Author's name" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" type="url" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="relatedTools">Related Tools (Slugs)</Label>
                        <Input id="relatedTools" name="relatedTools" placeholder="e.g. tool-slug-1, tool-slug-2" />
                        <p className="text-xs text-muted-foreground">Enter tool slugs separated by commas.</p>
                    </div>

                    <Separator />
                    
                    <div>
                        <h3 className="text-lg font-medium">SEO Settings</h3>
                        <p className="text-sm text-muted-foreground">Customize search engine appearance.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input id="metaTitle" name="metaTitle" placeholder="SEO-friendly title (optional)" />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea id="metaDescription" name="metaDescription" placeholder="A short description for search engines (optional)" />
                    </div>

                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    )
}
