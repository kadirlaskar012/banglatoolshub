
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Users, Target } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে',
  description: 'বাংলা টুলস হাব এর লক্ষ্য, উদ্দেশ্য এবং আমাদের পেছনের গল্প সম্পর্কে জানুন। আমরা বাংলা ভাষাভাষীদের জন্য প্রযুক্তিকে সহজ করতে প্রতিশ্রুতিবদ্ধ।',
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">আমাদের সম্পর্কে</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          বাংলা টুলস হাব-এ স্বাগতম! আমরা একটি প্রযুক্তি-প্রেমী দল, যাদের মূল লক্ষ্য হলো বাংলা ভাষাভাষী মানুষের জন্য ডিজিটাল জীবনকে আরও সহজ ও গতিময় করে তোলা।
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-2xl">
            <Lightbulb className="w-6 h-6 text-primary" />
            আমাদের গল্প
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none font-body">
          <p>
            প্রযুক্তি আমাদের জীবনকে বদলে দিয়েছে, কিন্তু আমরা লক্ষ্য করেছি যে ইন্টারনেটে বেশিরভাগ টুল এবং রিসোর্স ইংরেজি ভাষাকেন্দ্রিক। বাংলা ভাষাভাষী ব্যবহারকারীদের প্রায়ই ভাষাগত বাধার কারণে অনেক দরকারি টুল ব্যবহার করতে অসুবিধা হয়। এই সমস্যা সমাধানের একটি ক্ষুদ্র প্রচেষ্টা হিসেবেই 'বাংলা টুলস হাব'-এর জন্ম। আমাদের স্বপ্ন ছিল এমন একটি প্ল্যাটফর্ম তৈরি করার, যেখানে দৈনন্দিন জীবনের প্রয়োজনীয় সব ডিজিটাল টুলস বাংলায় পাওয়া যাবে এবং যে কেউ কোনো প্রকার কারিগরি জ্ঞান ছাড়াই সেগুলো ব্যবহার করতে পারবেন।
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
              <Target className="w-6 h-6 text-primary" />
              আমাদের লক্ষ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none font-body">
            <p>
              আমাদের প্রধান লক্ষ্য হলো প্রযুক্তির শক্তিকে বাংলা ভাষাভাষী সাধারণ মানুষের দোরগোড়ায় পৌঁছে দেওয়া। আমরা এমন টুল তৈরি করতে চাই যা ছাত্রছাত্রী, পেশাজীবী, লেখক, ফ্রিল্যান্সার এবং সাধারণ ব্যবহারকারীদের দৈনন্দিন কাজকে আরও সহজ, দ্রুত এবং নির্ভুল করে তুলবে। আমরা বিশ্বাস করি, ভাষার সীমাবদ্ধতা যেন প্রযুক্তির সুবিধা গ্রহণের পথে বাধা হয়ে না দাঁড়ায়।
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
              <Users className="w-6 h-6 text-primary" />
              আমরা কারা?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none font-body">
            <p>
              আমরা কিছু উদ্যমী ডেভেলপার, ডিজাইনার এবং কন্টেন্ট নির্মাতাদের একটি দল। প্রযুক্তি এবং বাংলা ভাষার প্রতি ভালোবাসা থেকেই আমাদের এই উদ্যোগ। আমরা প্রতিনিয়ত চেষ্টা করছি নতুন নতুন টুল যোগ করতে এবং বিদ্যমান টুলগুলোকে আরও উন্নত করতে, যাতে ব্যবহারকারীরা সেরা অভিজ্ঞতা পান। আপনার যেকোনো পরামর্শ বা মতামত আমাদের জন্য অত্যন্ত মূল্যবান।
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
