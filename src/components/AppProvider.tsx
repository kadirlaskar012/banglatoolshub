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
    <>
      {children}
    </>
  );
}
