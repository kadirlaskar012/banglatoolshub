import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // The actual layout for this route is handled by the AppProvider.
  // This file is necessary for Next.js to recognize /admin as a route group
  // with its own layout structure.
  return <>{children}</>;
}
