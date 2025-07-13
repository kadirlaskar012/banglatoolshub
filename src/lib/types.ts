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
  content: string; // The primary content of the tool page, used for AI suggestions
}

export interface BlogPost {
  id:string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string; // Should be in ISO format
  imageUrl: string;
  relatedTools?: string[]; // array of tool slugs
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}
