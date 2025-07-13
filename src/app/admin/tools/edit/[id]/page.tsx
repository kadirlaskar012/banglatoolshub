import Breadcrumbs from '@/components/Breadcrumbs';
import { ToolForm } from '@/components/admin/ToolForm';
import { getToolById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditToolPage({ params }: { params: { id: string } }) {
  const tool = await getToolById(params.id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Tools', href: '/admin/tools' },
          { label: `Edit: ${tool.name}` },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold font-headline">Edit Tool</h1>
        <p className="text-muted-foreground">Update the details for the tool "{tool.name}".</p>
      </div>
      <ToolForm tool={tool} />
    </div>
  );
}
