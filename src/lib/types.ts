import type { LucideProps } from 'lucide-react';
import type { Icons } from '@/components/icons';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: keyof typeof Icons;
  category: string;
  contentHtml: string;
  metaTitle?: string;
  metaDescription?: string;
  faq?: {
    question: string;
    answer: string;
  }[];
}

export interface BlogPost {
  id:string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  author: string;
  publishedAt: string; // Should be in ISO format
  imageUrl?: string;
  relatedTools?: string[]; // array of tool slugs
  metaTitle?: string;
  metaDescription?: string;
  faq?: {
    question: string;
    answer: string;
  }[];
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}
