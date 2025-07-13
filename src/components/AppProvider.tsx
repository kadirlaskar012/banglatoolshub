'use client';

import { type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { MenuPost, MenuTool } from '@/lib/types';

interface AppProviderProps {
    children: ReactNode;
    menuData: {
        tools: MenuTool[];
        posts: MenuPost[];
    }
}

export function AppProvider({ children, menuData }: AppProviderProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header menuData={menuData} />
      <main className="container flex-grow py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}
