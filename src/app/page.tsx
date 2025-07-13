
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTools, getBlogPosts } from '@/lib/data';
import ToolCard from '@/components/ToolCard';
import PostCard from '@/components/PostCard';
import { ArrowRight, HelpCircle, CheckCircle, BrainCircuit } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
    {
        question: "এই ওয়েবসাইটের টুলগুলো কি বিনামূল্যে ব্যবহার করা যায়?",
        answer: "হ্যাঁ, আমাদের ওয়েবসাইটের সমস্ত টুল সম্পূর্ণ বিনামূল্যে ব্যবহার করা যায়। আমরা বিশ্বাস করি, প্রয়োজনীয় ডিজিটাল টুলস সবার জন্য সহজলভ্য হওয়া উচিত।"
    },
    {
        question: "টুলগুলো ব্যবহার করার জন্য কি অ্যাকাউন্ট তৈরি করতে হবে?",
        answer: "না, আমাদের বেশিরভাগ টুল ব্যবহার করার জন্য কোনো ধরনের রেজিস্ট্রেশন বা অ্যাকাউন্ট তৈরির প্রয়োজন নেই। আপনি সরাসরি ওয়েবসাইটে এসে টুলগুলো ব্যবহার শুরু করতে পারেন।"
    },
    {
        question: "আমার ডেটা কি এখানে নিরাপদ?",
        answer: "আপনার গোপনীয়তা আমাদের কাছে সর্বোচ্চ অগ্রাধিকার পায়। আমাদের টুলগুলো ক্লায়েন্ট-সাইড অর্থাৎ আপনার ব্রাউজারেই কাজ করে এবং আমরা আপনার কোনো ব্যক্তিগত তথ্য আমাদের সার্ভারে সংরক্ষণ করি না।"
    }
];

const HomeSchemaMarkup = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bangla Tools HUB',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/tools?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bangla Tools HUB',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`, // Assuming you have a logo at public/logo.png
    sameAs: [
      // Add URLs to your social media profiles here
      // "https://www.facebook.com/yourprofile",
      // "https://www.twitter.com/yourprofile",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
};


export default async function Home() {
  const allTools = await getTools();
  const allPosts = await getBlogPosts();
  
  const featuredTools = allTools.slice(0, 6);
  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24">
       <HomeSchemaMarkup />
      <section className="text-center pt-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground">
          বাংলা টুলস হাব
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground font-body">
          বাংলা ভাষার জন্য তৈরি বিভিন্ন ইউটিলিটি, কনভার্টার এবং ক্রিয়েটিভ টুলের সেরা ঠিকানা। আপনার দৈনন্দিন কাজকে আরও সহজ ও গতিময় করতে আমরা নিয়ে এসেছি একগুচ্ছ শক্তিশালী টুলস।
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/tools">
              সব টুল দেখুন <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/blog">আমাদের ব্লগ পড়ুন</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">
            জনপ্রিয় টুলস
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">আমাদের সবচেয়ে বেশি ব্যবহৃত এবং কার্যকরী টুলগুলো আবিষ্কার করুন।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-muted/50 p-8 rounded-lg">
        <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold">
                আমাদের লক্ষ্য
            </h2>
            <p className="text-muted-foreground text-lg">
                বাংলা ভাষাভাষী ব্যবহারকারীদের জন্য প্রযুক্তিকে সহজলভ্য করাই আমাদের প্রধান উদ্দেশ্য। আমরা এমন একটি প্ল্যাটফর্ম তৈরি করতে চাই যেখানে যে কেউ সহজেই তাদের প্রয়োজনীয় ডিজিটাল টুলস খুঁজে পাবে এবং কোনো প্রকার কারিগরি জ্ঞান ছাড়াই সেগুলো ব্যবহার করতে পারবে। শিক্ষা, কাজ এবং সৃজনশীলতায় আধুনিক প্রযুক্তির শক্তিকে কাজে লাগিয়ে বাংলাকে আরও সমৃদ্ধ করতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
        </div>
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 text-primary rounded-full">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">সহজ ব্যবহার</h3>
                    <p className="text-muted-foreground">আমাদের প্রতিটি টুল সহজবোধ্য এবং ব্যবহারকারী-বান্ধব ইন্টারফেস দিয়ে ডিজাইন করা, যাতে যে কেউ সহজেই ব্যবহার করতে পারে।</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 text-primary rounded-full">
                    <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">এআই-চালিত ফিচার</h3>
                    <p className="text-muted-foreground">আমরা আধুনিক এআই প্রযুক্তি ব্যবহার করে এমন টুল তৈরি করি যা আপনার কাজকে আরও দ্রুত এবং নির্ভুল করতে সাহায্য করে।</p>
                </div>
            </div>
        </div>
      </section>

      <section>
        <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">
            ব্লগ থেকে পড়ুন
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">প্রযুক্তি এবং টুলস সম্পর্কিত সর্বশেষ টিপস এবং ট্রিকস জানতে আমাদের ব্লগ পড়ুন।</p>
        </div>
        <div className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

       <section>
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
