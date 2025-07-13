'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuTool, MenuPost } from '@/lib/types';
import { Icons } from '@/components/icons';
import { getMenuData } from '@/lib/data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from '@/components/ui/scroll-area';

interface HeaderProps {
    menuData: {
        tools: MenuTool[];
        posts: MenuPost[];
    }
}

export default function Header({ menuData }: HeaderProps) {
    const pathname = usePathname();
    const { tools, posts } = menuData;

    const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            <Link
                href="/"
                className={cn(
                    'transition-colors hover:text-primary',
                    pathname === '/' ? 'text-primary' : 'text-foreground/60',
                    isMobile ? 'px-4 py-2 text-lg' : 'text-sm font-medium'
                )}
            >
                Home
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn('gap-1', pathname.startsWith('/tools') ? 'text-primary' : 'text-foreground/60', isMobile && 'justify-start w-full px-4 py-2 text-lg', !isMobile && 'text-sm font-medium')}>
                        Tools <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <ScrollArea className="h-72">
                        {tools.map((tool) => (
                            <DropdownMenuItem key={tool.slug} asChild>
                                <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className={cn('gap-1', pathname.startsWith('/blog') ? 'text-primary' : 'text-foreground/60', isMobile && 'justify-start w-full px-4 py-2 text-lg', !isMobile && 'text-sm font-medium')}>
                        Blog <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <ScrollArea className="h-72">
                        {posts.map((post) => (
                            <DropdownMenuItem key={post.slug} asChild>
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Icons.logo className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block font-headline">
                        Bangla Tools HUB
                    </span>
                </Link>

                <div className="flex flex-1 items-center justify-end">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <NavLinks />
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="pr-0">
                                <Link href="/" className="flex items-center space-x-2 mb-6 px-4">
                                    <Icons.logo className="h-6 w-6 text-primary" />
                                    <span className="font-bold font-headline">Bangla Tools HUB</span>
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
