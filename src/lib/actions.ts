'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import type { Tool, BlogPost } from './types';

// Common state for form actions
type FormState = {
    message: string | null;
    success?: boolean;
};

// Schema for Tool validation
const ToolSchema = z.object({
    name: z.string().min(1, "Name is required."),
    slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().min(1, "Short description is required."),
    longDescription: z.string().min(1, "Long description is required."),
    category: z.string().min(1, "Category is required."),
    content: z.string().min(1, "Content for AI suggestions is required."),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

// Server action to add a new tool
export async function addTool(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = ToolSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { message: "Validation failed: " + validatedFields.error.flatten().fieldErrors };
    }

    try {
        const newTool: Omit<Tool, 'id' | 'icon'> & { icon: string } = {
            ...validatedFields.data,
            icon: 'pen', // Default icon
        };
        await addDoc(collection(db, 'tools'), newTool);
    } catch (error) {
        return { message: "Could not create tool in Firestore." };
    }
    
    revalidatePath('/admin/tools');
    revalidatePath('/tools');
    return { message: null, success: true };
}

// Server action to update a tool
export async function updateTool(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = ToolSchema.safeParse(Object.fromEntries(formData.entries()));

     if (!validatedFields.success) {
        return { message: "Validation failed: " + validatedFields.error.flatten().fieldErrors };
    }
    
    try {
        const toolRef = doc(db, 'tools', id);
        await updateDoc(toolRef, validatedFields.data);
    } catch (error) {
        return { message: "Could not update tool in Firestore." };
    }

    revalidatePath('/admin/tools');
    revalidatePath(`/tools/${validatedFields.data.slug}`);
    revalidatePath(`/admin/tools/edit/${id}`);
    return { message: null, success: true };
}

// Server action to delete a tool
export async function deleteTool(id: string) {
    try {
        await deleteDoc(doc(db, 'tools', id));
    } catch (error) {
        console.error("Error deleting tool:", error);
        throw new Error("Could not delete tool.");
    }
    revalidatePath('/admin/tools');
}


// Schema for BlogPost validation
const BlogPostSchema = z.object({
    title: z.string().min(1, "Title is required."),
    slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    excerpt: z.string().min(1, "Excerpt is required."),
    content: z.string().min(1, "Content is required."),
    author: z.string().min(1, "Author is required."),
    imageUrl: z.string().url("Must be a valid URL."),
    relatedTools: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});


// Server action to add a new blog post
export async function addBlogPost(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = BlogPostSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }
    
    try {
        const newPostData = {
            ...validatedFields.data,
            relatedTools: validatedFields.data.relatedTools ? validatedFields.data.relatedTools.split(',').map(s => s.trim()) : [],
            publishedAt: new Date().toISOString(),
        };

        await addDoc(collection(db, 'blogPosts'), newPostData);

    } catch (error) {
        console.error("Error adding blog post to Firestore:", error);
        throw new Error("Could not create blog post.");
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    redirect('/admin/blog');
}

// Dev-only action to transfer data
export async function transferDataToFirestore(data: { tools?: Partial<Tool>[], blogPosts?: Partial<BlogPost>[] }) {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('This action is only available in development mode.');
    }

    try {
        if (data.tools) {
            for (const tool of data.tools) {
                await addDoc(collection(db, 'tools'), { icon: 'pen', ...tool });
            }
        }
        if (data.blogPosts) {
            for (const post of data.blogPosts) {
                await addDoc(collection(db, 'blogPosts'), { publishedAt: new Date().toISOString(), ...post });
            }
        }
        revalidatePath('/admin/tools');
        revalidatePath('/admin/blog');
        return { success: true, message: 'Data transferred successfully.' };
    } catch (error) {
        console.error('Data transfer failed:', error);
        return { success: false, message: 'Data transfer failed.' };
    }
}
