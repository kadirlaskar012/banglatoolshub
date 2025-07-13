'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Home, Wrench, Newspaper, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Icons } from './icons';

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <Sidebar className="border-r">
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <Icons.logo className="w-8 h-8 text-primary" />
                <span className="font-headline text-lg font-semibold">Admin</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/admin" asChild>
                    <Link href="/admin">
                      <Home />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/tools" asChild>
                    <Link href="/admin/tools">
                      <Wrench />
                      Tools
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/admin/blog" asChild>
                    <Link href="/admin/blog">
                      <Newspaper />
                      Blog
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <LogOut />
                      Logout
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </SidebarProvider>
    );
  }

  if (isLoginRoute) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-4">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-grow py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}
