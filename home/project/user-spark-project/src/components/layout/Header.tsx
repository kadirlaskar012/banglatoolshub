
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuTool, MenuPost } from '@/lib/types';
import { Icons } from '@/components/icons';

interface HeaderProps {
  menuData: {
    tools: MenuTool[];
    posts: MenuPost[];
  };
}

export default function Header({ menuData }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'হোম' },
    { href: '/tools', label: 'টুলস' },
    { href: '/blog', label: 'ব্লগ' },
    { href: '/about', label: 'আমাদের সম্পর্কে' },
  ];

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-primary',
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              ? 'text-primary'
              : 'text-foreground/60',
            isMobile ? 'px-4 py-2 text-lg' : 'text-sm font-medium'
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              বাংলা টুলস হাব
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">মেনু</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="flex items-center space-x-2 mb-6 px-4">
                  <Icons.logo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">বাংলা টুলস হাব</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  <NavLinks isMobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
