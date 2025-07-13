'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addTool } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { iconMap } from '@/components/icons';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Creating...' : 'Create Tool'}
        </Button>
    );
}

export function ToolForm() {
    return (
        <form action={addTool}>
            <Card>
                <CardHeader>
                    <CardTitle>Tool Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tool Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Bangla Spell Checker" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" placeholder="e.g. bangla-spell-checker" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Input id="description" name="description" placeholder="A brief, one-line summary of the tool." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description</Label>
                        <Textarea id="longDescription" name="longDescription" placeholder="A more detailed explanation of what the tool does." required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" placeholder="e.g. Writing Utilities" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon</Label>
                             <select name="icon" id="icon" required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                                <option value="" disabled selected>Select an icon</option>
                                {Object.keys(iconMap).map(iconKey => (
                                    <option key={iconKey} value={iconKey}>{iconKey}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content for AI Suggestions</Label>
                        <Textarea id="content" name="content" placeholder="Describe the tool's purpose and features for the AI to understand and suggest it correctly." required />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    )
}