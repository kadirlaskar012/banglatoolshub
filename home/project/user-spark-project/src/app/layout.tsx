
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getMenuData } from '@/lib/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'বাংলা টুলস হাব',
    template: '%s | বাংলা টুলস হাব',
  },
  description: 'আধুনিক বাংলা ব্যবহারকারীদের জন্য প্রয়োজনীয় টুলের সমাহার।',
  openGraph: {
    title: 'বাংলা টুলস হাব',
    description: 'আধুনিক বাংলা ব্যবহারকারীদের জন্য প্রয়োজনীয় টুলের সমাহার।',
    url: BASE_URL,
    siteName: 'বাংলা টুলস হাব',
    images: [
      {
        url: `${BASE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'বাংলা টুলস হাব',
    description: 'আধুনিক বাংলা ব্যবহারকারীদের জন্য প্রয়োজনীয় টুলের সমাহার।',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuData = await getMenuData();

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital,wght@0,400;1,400&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        <div className="flex min-h-screen flex-col">
          <Header menuData={menuData} />
          <main className="container flex-grow px-0 py-8 md:py-12">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
