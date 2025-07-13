// This file will contain server actions for CUD operations
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import type { Tool, BlogPost } from './types';


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
export async function addTool(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = ToolSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }

    try {
        const newTool: Omit<Tool, 'id'> = {
            ...validatedFields.data,
            icon: 'pen', // Default icon
        };
        await addDoc(collection(db, 'tools'), newTool);
    } catch (error) {
        console.error("Error adding tool to Firestore:", error);
        throw new Error("Could not create tool.");
    }
    
    revalidatePath('/admin/tools');
    revalidatePath('/tools');
    redirect('/admin/tools');
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
