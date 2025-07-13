import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Tool, BlogPost } from './types';
import {-transform} from 'stream';

const toolsDirectory = path.join(process.cwd(), 'src/content/tools');
const blogDirectory = path.join(process.cwd(), 'src/content/blog');

// Helper function to add IDs to headings
const addHeadingIds = () => {
    return (tree: any) => {
        const {visit} = require('unist-util-visit');
        visit(tree, 'heading', (node: any) => {
            if (node.depth === 2) { // Only add IDs to h2 tags
                const textContent = node.children.map((child: any) => child.value || '').join('');
                if (textContent) {
                    node.data = node.data || {};
                    node.data.hProperties = node.data.hProperties || {};
                    (node.data.hProperties as any).id = textContent.toLowerCase().replace(/\s+/g, '-').replace(/[?]/g, '');
                }
            }
        });
    };
};

// Helper function to read and parse a markdown file
async function parseMarkdownFile(fullPath: string) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // If file is empty or just frontmatter, return empty content
    if (matterResult.content.trim() === '') {
        return {
            contentHtml: '',
            ...matterResult.data,
        }
    }

    const processedContent = await remark()
        .use(addHeadingIds)
        .use(html, { sanitize: false })
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
    const allToolsDataPromises = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async (fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(toolsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            if (fileContents.trim() === '') return null; // Skip empty files
            const matterResult = matter(fileContents);

            return {
                id: slug,
                slug,
                ...matterResult.data,
            } as Tool;
    });

    const allToolsData = (await Promise.all(allToolsDataPromises)).filter(Boolean) as Tool[];
    return allToolsData;
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
    const fullPath = path.join(toolsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    if (fileContents.trim() === '') return null; // Skip empty files

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
    if (!fs.existsSync(blogDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsDataPromises = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async (fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(blogDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            if (fileContents.trim() === '') return null; // Skip empty files
            
            const matterResult = matter(fileContents);
            
            return {
                id: slug,
                slug,
                ...matterResult.data,
            } as BlogPost;
    });

    const allPostsData = (await Promise.all(allPostsDataPromises)).filter(Boolean) as BlogPost[];
    
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
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    if (fileContents.trim() === '') return null;

    const { contentHtml, ...data } = await parseMarkdownFile(fullPath);
    
    return {
        id: slug,
        slug,
        contentHtml,
        ...(data as Omit<BlogPost, 'id'|'slug'|'contentHtml'>)
    };
}
