import type { Tool, BlogPost } from './types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { Icons } from '@/components/icons';

// Helper function to map Firestore document data to our types
function mapDocToTool(docSnapshot: any): Tool {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        icon: data.icon as keyof typeof Icons || 'pen',
        category: data.category,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
    };
}

function mapDocToBlogPost(docSnapshot: any): BlogPost {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        publishedAt: data.publishedAt, // Assuming it's stored as an ISO string
        imageUrl: data.imageUrl,
        relatedTools: data.relatedTools || [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
    };
}


export const getTools = async (): Promise<Tool[]> => {
    try {
        const toolsCollection = collection(db, 'tools');
        const toolSnapshot = await getDocs(toolsCollection);
        return toolSnapshot.docs.map(mapDocToTool);
    } catch (error) {
        console.error("Error fetching tools:", error);
        return [];
    }
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
    try {
        const q = query(collection(db, "tools"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        return mapDocToTool(querySnapshot.docs[0]);
    } catch (error) {
        console.error("Error fetching tool by slug:", error);
        return null;
    }
};

export const getToolById = async (id: string): Promise<Tool | null> => {
    try {
        const toolDoc = await getDoc(doc(db, "tools", id));
        if (!toolDoc.exists()) {
            return null;
        }
        return mapDocToTool(toolDoc);
    } catch (error) {
        console.error("Error fetching tool by id:", error);
        return null;
    }
};


export const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const postsCollection = collection(db, 'blogPosts');
        const postSnapshot = await getDocs(postsCollection);
        return postSnapshot.docs.map(mapDocToBlogPost);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
     try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        return mapDocToBlogPost(querySnapshot.docs[0]);
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
};
