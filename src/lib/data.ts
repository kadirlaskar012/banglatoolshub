import type { Tool, BlogPost } from './types';
import { Icons } from '@/components/icons';

const tools: Tool[] = [
  {
    id: '1',
    slug: 'bangla-unicode-converter',
    name: 'Bangla Unicode Converter',
    description: 'Convert Bijoy, Avro, or other legacy fonts to Unicode.',
    longDescription: 'Our Bangla Unicode Converter is an essential tool for anyone working with Bengali text. It seamlessly converts text from older, non-standard fonts like Bijoy or SutonnyMJ to the universal Unicode standard. This ensures your text is readable and searchable across all devices and platforms. The tool supports various legacy formats and provides instant, accurate conversions.',
    icon: Icons.type,
    category: 'Converter',
    content: 'Bangla Unicode Converter tool for converting legacy fonts like Bijoy and Avro to modern, web-safe Unicode text. This is useful for web content, documents, and ensuring cross-platform compatibility.',
  },
  {
    id: '2',
    slug: 'image-to-text-ocr',
    name: 'Image to Text (OCR)',
    description: 'Extract Bangla text from images with high accuracy.',
    longDescription: 'Effortlessly extract editable Bangla text from any image file. Our powerful Optical Character Recognition (OCR) engine is specifically trained for the Bengali script, delivering high accuracy for both printed and handwritten text. Simply upload an image, and our tool will provide the recognized text, ready to be copied, edited, or translated.',
    icon: Icons.image,
    category: 'Utility',
    content: 'Bangla OCR (Optical Character Recognition) service to extract text from images. This is perfect for digitizing printed documents, books, or any visual media containing Bengali script.',
  },
  {
    id: '3',
    slug: 'date-formatter-bangla',
    name: 'Date Formatter (Bangla)',
    description: 'Format dates into various Bengali calendar formats.',
    longDescription: 'This tool allows you to convert Gregorian dates into the Bengali calendar format and vice-versa. You can also format dates into various styles commonly used in Bangladesh and West Bengal, making it perfect for official documents, invitations, and websites catering to a Bengali audience.',
    icon: Icons.calculator,
    category: 'Formatter',
    content: 'A tool for formatting and converting dates between Gregorian and Bengali calendar systems. It provides various formatting options for display in articles, official documents, or applications.',
  },
  {
    id: '4',
    slug: 'bangla-spell-checker',
    name: 'Bangla Spell Checker',
    description: 'Check for and correct spelling mistakes in your Bangla text.',
    longDescription: 'Write with confidence using our advanced Bangla Spell Checker. It identifies common and complex spelling errors, suggesting corrections based on a comprehensive dictionary. Ideal for students, writers, and professionals, this tool helps ensure your documents, emails, and articles are error-free and professional.',
    icon: Icons.pen,
    category: 'Writing',
    content: 'An intelligent spell-checking tool for the Bengali language. It helps users write error-free text by identifying spelling mistakes and suggesting correct alternatives. Useful for articles, emails, and professional writing.',
  },
];

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'the-importance-of-unicode-for-bangla',
    title: 'The Importance of Unicode for Bangla on the Web',
    excerpt: 'Discover why Unicode is the gold standard for Bengali content and how it impacts SEO, accessibility, and user experience.',
    content: 'The digital world speaks in code, and for the Bangla language, Unicode is the universal translator. Before Unicode, various proprietary fonts like Bijoy made it difficult to share and display Bengali text consistently across different computers and websites. This often resulted in garbled text, known as "font breaking". Unicode solves this by assigning a unique code to every character, ensuring that "ক" is always "ক", no matter the device or platform. For content creators, using Unicode is crucial for Search Engine Optimization (SEO), as search engines can easily read and index the text. It also makes content accessible to screen readers for visually impaired users. Our **Bangla Unicode Converter** is the perfect tool to modernize your old content.',
    author: 'AI Assistant',
    publishedAt: '2023-10-26',
    imageUrl: 'https://placehold.co/600x400.png',
    relatedTools: ['bangla-unicode-converter', 'image-to-text-ocr'],
  },
  {
    id: '2',
    slug: 'digitizing-old-bangla-books',
    title: 'A Guide to Digitizing Old Bangla Books with OCR',
    excerpt: 'Learn the process of turning physical Bengali books and documents into editable, digital text using OCR technology.',
    content: 'Many valuable Bengali books and historical documents exist only in print. Digitizing them makes this knowledge accessible to a global audience. The key technology for this process is Optical Character Recognition (OCR). OCR software analyzes an image of a page and converts the printed characters into editable digital text. While generic OCR tools exist, those specifically trained on the Bengali script offer much higher accuracy. Our **Image to Text (OCR)** tool is designed for this purpose, helping preserve cultural heritage and making information searchable and shareable. The process is simple: scan the page, upload the image, and let the tool work its magic.',
    author: 'AI Assistant',
    publishedAt: '2023-10-22',
    imageUrl: 'https://placehold.co/600x400.png',
    relatedTools: ['image-to-text-ocr', 'bangla-spell-checker'],
  },
];

export const getTools = () => tools;
export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

export const getBlogPosts = () => blogPosts;
export const getBlogPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
