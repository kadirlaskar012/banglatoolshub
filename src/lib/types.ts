import type { LucideProps } from 'lucide-react';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<LucideProps>;
  category: string;
  content: string; // The primary content of the tool page, used for AI suggestions
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  relatedTools?: string[]; // array of tool slugs
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}
