'use client';

import { type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-grow py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}
