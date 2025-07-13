import type { Tool, BlogPost } from './types';

// This file contains sample data that can be transferred to Firestore in development mode.
// This is useful for populating the database after it has been cleared or for testing.
// I can add more data here based on our chat conversation.

export const devData: { tools: Omit<Tool, 'id'>[], blogPosts: Omit<BlogPost, 'id' | 'publishedAt'>[] } = {
  tools: [
    // I can add tool data here
  ],
  blogPosts: [
    // I can add blog post data here
  ],
};
