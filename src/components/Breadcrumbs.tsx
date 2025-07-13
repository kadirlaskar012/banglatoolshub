import Link from 'next/link';
import { Fragment } from 'react';
import { Icons } from './icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <Fragment key={index}>
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              )}
            </li>
            {index < items.length - 1 && (
              <li>
                <Icons.chevronRight className="h-4 w-4" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
