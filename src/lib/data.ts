import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Tool, BlogPost } from './types';

const toolsDirectory = path.join(process.cwd(), 'src/content/tools');
const blogDirectory = path.join(process.cwd(), 'src/content/blog');

// Helper function to read and parse a markdown file
async function parseMarkdownFile(fullPath: string) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        contentHtml,
        ...matterResult.data,
    };
}


// --- TOOLS ---

export async function getTools(): Promise<Tool[]> {
    const fileNames = fs.readdirSync(toolsDirectory);
    const allToolsData = await Promise.all(fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(toolsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id: slug,
            slug,
            ...matterResult.data,
        } as Tool;
    }));
    return allToolsData;
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
    const fullPath = path.join(toolsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const { contentHtml, ...data } = await parseMarkdownFile(fullPath);
    return {
        id: slug,
        slug,
        contentHtml,
        ...(data as Omit<Tool, 'id'|'slug'|'contentHtml'>)
    };
}


// --- BLOG POSTS ---

export async function getBlogPosts(): Promise<BlogPost[]> {
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        return {
            id: slug,
            slug,
            ...matterResult.data,
        } as BlogPost;
    }));
    // Sort posts by date in descending order
    return allPostsData.sort((a, b) => {
        if (a.publishedAt < b.publishedAt) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
     if (!fs.existsSync(fullPath)) {
        return null;
    }
    const { contentHtml, ...data } = await parseMarkdownFile(fullPath);
    
    return {
        id: slug,
        slug,
        contentHtml,
        ...(data as Omit<BlogPost, 'id'|'slug'|'contentHtml'>)
    };
}
