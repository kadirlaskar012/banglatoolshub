import { getTools } from '@/lib/data';
import ToolCard from '@/components/ToolCard';

export const metadata = {
  title: 'সমস্ত টুলস | বাংলা টুলস হাব',
  description: 'আমাদের প্রয়োজনীয় বাংলা টুলগুলোর সংগ্রহ ব্রাউজ করুন।',
};

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">আমাদের টুলস</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          আপনার জীবনকে সহজ করার জন্য তৈরি একগুচ্ছ অ্যাপ্লিকেশন।
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
