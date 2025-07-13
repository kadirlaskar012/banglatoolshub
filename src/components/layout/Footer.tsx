import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by your friendly neighborhood AI.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bangla Tools HUB. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
