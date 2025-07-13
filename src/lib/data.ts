import type { Tool, BlogPost } from './types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { Icons } from '@/components/icons';

const iconMap: { [key: string]: React.ComponentType<any> } = Icons;


// Helper function to map Firestore document data to our types
function mapDocToTool(doc: any): Tool {
    const data = doc.data();
    return {
        id: doc.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        icon: data.icon as keyof typeof Icons,
        category: data.category,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
    };
}

function mapDocToBlogPost(doc: any): BlogPost {
    const data = doc.data();
    return {
        id: doc.id,
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
