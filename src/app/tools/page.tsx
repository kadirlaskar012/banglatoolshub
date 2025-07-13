import { getTools } from '@/lib/data';
import ToolCard from '@/components/ToolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'সমস্ত টুলস | বাংলা টুলস হাব',
  description: 'আমাদের প্রয়োজনীয় বাংলা টুলগুলোর সংগ্রহ ব্রাউজ করুন। বয়স ক্যালকুলেটর থেকে শুরু করে প্লেজিয়ারিজম চেকার, আপনার সব প্রয়োজনীয় টুল এখানে পাবেন।',
};

const faqItems = [
    {
        question: "এই টুলগুলো কি মোবাইল ফোনে ব্যবহার করা যাবে?",
        answer: "হ্যাঁ, আমাদের সমস্ত টুল সম্পূর্ণ রেসপন্সিভ। আপনি যেকোনো ডিভাইস, যেমন মোবাইল, ট্যাবলেট বা কম্পিউটার থেকে স্বাচ্ছন্দ্যে এগুলো ব্যবহার করতে পারবেন।"
    },
    {
        question: "আমি একটি টুলের অনুরোধ করতে পারি কি?",
        answer: "অবশ্যই! আমরা সবসময় নতুন এবং প্রয়োজনীয় টুল তৈরি করতে আগ্রহী। আপনার যদি কোনো নির্দিষ্ট টুলের প্রয়োজন হয়, যা আমাদের ওয়েবসাইটে নেই, তাহলে আপনি আমাদের সাথে যোগাযোগ করে জানাতে পারেন।"
    },
    {
        question: "টুলগুলোর ফলাফল কতটা নির্ভরযোগ্য?",
        answer: "আমরা প্রতিটি টুল সর্বোচ্চ নির্ভুলতা নিশ্চিত করার জন্য তৈরি করেছি। আমাদের ক্যালকুলেটর, কনভার্টার এবং চেকারগুলো শক্তিশালী অ্যালগরিদমের উপর ভিত্তি করে কাজ করে, তাই আপনি ফলাফলের উপর আস্থা রাখতে পারেন।"
    }
];

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">আমাদের টুলস</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          আপনার জীবনকে সহজ করার জন্য তৈরি একগুচ্ছ অ্যাপ্লিকেশন। এখানে আপনি ফিনান্স, লেখালেখি, এসইও, এবং দৈনন্দিন জীবনের নানা কাজের জন্য প্রয়োজনীয় টুলস পাবেন। আমাদের প্রতিটি টুলই বাংলাভাষী ব্যবহারকারীদের কথা মাথায় রেখে ডিজাইন করা হয়েছে।
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      <section className='mt-16'>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                        <HelpCircle className="w-6 h-6 text-primary"/>
                        সাধারণ প্রশ্ন (FAQ)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left font-semibold text-lg">{item.question}</AccordionTrigger>
                                <AccordionContent className="prose prose-lg max-w-none font-body">
                                    <p>{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </section>
    </div>
  );
}
