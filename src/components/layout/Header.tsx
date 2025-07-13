'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/lib/types';
import { Icons } from '@/components/icons';

const navItems: NavItem[] = [
  { title: 'Tools', href: '/tools' },
  { title: 'Blog', href: '/blog' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Bangla Tools HUB
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                    <Icons.logo className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">Bangla Tools HUB</span>
                </Link>
                <nav className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                        'text-muted-foreground transition-colors hover:text-primary',
                        pathname === item.href && 'text-primary'
                        )}
                    >
                        {item.title}
                    </Link>
                    ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="flex items-center">
            <Button asChild variant="outline">
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
