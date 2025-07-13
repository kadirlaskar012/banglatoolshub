import { getBlogPosts } from '@/lib/data';
import PostCard from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'ব্লগ | বাংলা টুলস হাব',
  description: 'বাংলা টুলস হাব টিমের লেখা বিভিন্ন আর্টিকেল, টিউটোরিয়াল এবং আপডেট। প্রযুক্তি, লেখালেখি এবং আর্থিক পরিকল্পনা নিয়ে জানুন বাংলায়।',
};

const faqItems = [
    {
        question: "এই ব্লগে কোন কোন বিষয়ে লেখা হয়?",
        answer: "আমাদের ব্লগে মূলত প্রযুক্তি, ডিজিটাল মার্কেটিং, কন্টেন্ট রাইটিং, এসইও (SEO), এবং আর্থিক পরিকল্পনার মতো বিষয়গুলো নিয়ে সহজ বাংলায় আলোচনা করা হয়। আমাদের লক্ষ্য হলো এই বিষয়গুলোকে সবার জন্য সহজবোধ্য করে তোলা।"
    },
    {
        question: "ব্লগের আর্টিকেলগুলো কি নতুনদের জন্য উপযোগী?",
        answer: "হ্যাঁ, অবশ্যই। আমরা প্রতিটি আর্টিকেল এমনভাবে লিখি যাতে নতুনরাও সহজে বুঝতে পারেন। আমরা জটিল বিষয়গুলোকে সহজ উদাহরণ দিয়ে ব্যাখ্যা করি, যা সকল স্তরের পাঠকের জন্য উপকারী।"
    },
    {
        question: "আমি কি কোনো নির্দিষ্ট বিষয়ে লেখার জন্য অনুরোধ করতে পারি?",
        answer: "অবশ্যই! আমরা সবসময় ব্যবহারকারীদের কাছ থেকে পরামর্শ পেতে আগ্রহী। আপনার যদি কোনো নির্দিষ্ট বিষয়ে জানার আগ্রহ থাকে, তাহলে আমাদের সাথে যোগাযোগ করতে পারেন। আমরা আপনার অনুরোধ বিবেচনা করব।"
    }
];

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">আমাদের ব্লগ</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          প্রযুক্তি, উৎপাদনশীলতা এবং সৃজনশীলতার জগতে স্বাগতম। এখানে আমরা বিভিন্ন টিপস, গভীর বিশ্লেষণমূলক আর্টিকেল এবং টিউটোরিয়াল শেয়ার করি যা আপনাকে ডিজিটাল বিশ্বে এগিয়ে থাকতে সাহায্য করবে। আমাদের লক্ষ্য হল জটিল বিষয়গুলিকে সহজ বাংলায় উপস্থাপন করা।
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
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
