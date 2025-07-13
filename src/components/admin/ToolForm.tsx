'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addTool, updateTool } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { Tool } from '@/lib/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Tool' : 'Create Tool')}
        </Button>
    );
}

export function ToolForm({ tool }: { tool?: Tool }) {
    const isEditing = !!tool;
    const action = isEditing ? updateTool.bind(null, tool.id) : addTool;
    const [state, formAction] = useFormState(action, { message: null });
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state?.message) {
            toast({
                title: isEditing ? 'Update Failed' : 'Creation Failed',
                description: state.message,
                variant: 'destructive',
            });
        }
        if (state?.success) {
            toast({
                title: `Tool ${isEditing ? 'Updated' : 'Created'}`,
                description: `The tool "${tool?.name || ''}" has been successfully ${isEditing ? 'updated' : 'created'}.`,
            });
            router.push('/admin/tools');
        }
    }, [state, isEditing, tool?.name, router, toast]);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Tool' : 'Create New Tool'}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tool Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Bangla Spell Checker" required defaultValue={tool?.name}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" placeholder="e.g. bangla-spell-checker" required defaultValue={tool?.slug} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Input id="description" name="description" placeholder="A brief, one-line summary of the tool." required defaultValue={tool?.description}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description</Label>
                        <Textarea id="longDescription" name="longDescription" placeholder="A more detailed explanation of what the tool does." required defaultValue={tool?.longDescription}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="content">Content for AI Suggestions</Label>
                        <Textarea id="content" name="content" placeholder="Describe the tool's purpose and features for the AI to understand and suggest it correctly." required defaultValue={tool?.content} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" placeholder="e.g. Writing Utilities" required defaultValue={tool?.category}/>
                    </div>
                    
                    <Separator />
                    
                    <div>
                        <h3 className="text-lg font-medium">SEO Settings</h3>
                        <p className="text-sm text-muted-foreground">Customize search engine appearance.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input id="metaTitle" name="metaTitle" placeholder="SEO-friendly title (optional)" defaultValue={tool?.metaTitle} />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea id="metaDescription" name="metaDescription" placeholder="A short description for search engines (optional)" defaultValue={tool?.metaDescription} />
                    </div>

                </CardContent>
                <CardFooter>
                    <SubmitButton isEditing={isEditing} />
                </CardFooter>
            </Card>
        </form>
    )
}
