import { getTools } from '@/lib/data';
import ToolCard from '@/components/ToolCard';

export const metadata = {
  title: 'All Tools | Bangla Tools HUB',
  description: 'Browse our collection of essential tools for Bangla.',
};

export default function ToolsPage() {
  const tools = getTools();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Our Tools</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A suite of applications to make your life easier.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
