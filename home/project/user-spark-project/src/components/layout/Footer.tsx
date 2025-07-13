
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container">
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by your friendly neighborhood AI.
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary">আমাদের সম্পর্কে</Link>
            <Link href="/contact" className="hover:text-primary">যোগাযোগ</Link>
            <Link href="/privacy-policy" className="hover:text-primary">গোপনীয়তা নীতি</Link>
            <Link href="/terms" className="hover:text-primary">শর্তাবলী</Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bangla Tools HUB. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
