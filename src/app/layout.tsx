import type { Metadata } from 'next';
import { AppProvider } from '@/components/AppProvider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getMenuData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'বাংলা টুলস হাব',
  description: 'আধুনিক বাংলা ব্যবহারকারীদের জন্য প্রয়োজনীয় টুলের সমাহার।',
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
        <AppProvider menuData={menuData}>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
