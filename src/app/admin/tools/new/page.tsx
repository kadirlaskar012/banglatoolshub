import Breadcrumbs from '@/components/Breadcrumbs';
import { ToolForm } from '@/components/admin/ToolForm';

export default function NewToolPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Tools', href: '/admin/tools' },
          { label: 'New Tool' },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Tool</h1>
        <p className="text-muted-foreground">Fill out the form to add a new tool to the hub.</p>
      </div>
      <ToolForm />
    </div>
  );
}
