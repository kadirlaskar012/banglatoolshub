
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MessageSquare, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'যোগাযোগ',
  description: 'আমাদের সাথে যোগাযোগ করুন। আপনার যেকোনো প্রশ্ন, পরামর্শ বা মতামতের জন্য আমরা সর্বদা প্রস্তুত। আমাদের ইমেল করুন অথবা সোশ্যাল মিডিয়াতে কানেক্ট হন।',
};

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">যোগাযোগ করুন</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          আপনার যেকোনো প্রশ্ন, পরামর্শ বা মূল্যবান মতামতের জন্য আমরা অপেক্ষা করছি। আমাদের সাথে যোগাযোগ করতে নিচের যেকোনো মাধ্যম ব্যবহার করতে পারেন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
              <Mail className="w-6 h-6 text-primary" />
              ইমেল করুন
            </CardTitle>
            <CardDescription>
              সাধারণ জিজ্ঞাসা বা সাপোর্টের জন্য আমাদের ইমেল করুন। আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করব।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@banglatoolshub.com" className="text-lg font-semibold text-primary hover:underline">
              support@banglatoolshub.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
              <MessageSquare className="w-6 h-6 text-primary" />
              প্রস্তাবনা ও মতামত
            </CardTitle>
            <CardDescription>
              নতুন কোনো টুলের আইডিয়া বা আমাদের সাইটের উন্নতির জন্য কোনো পরামর্শ থাকলে আমাদের জানান।
            </CardDescription>
          </CardHeader>
          <CardContent>
             <a href="mailto:feedback@banglatoolshub.com" className="text-lg font-semibold text-primary hover:underline">
              feedback@banglatoolshub.com
            </a>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
         <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-xl">
              <AlertCircle className="w-5 h-5 text-primary"/>
              দ্রষ্টব্য
            </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none font-body">
          <p>
            বর্তমানে আমাদের কোনো ফোন নম্বর বা সরাসরি চ্যাটের সুবিধা নেই। যোগাযোগের জন্য অনুগ্রহ করে ইমেল ব্যবহার করুন। আমরা আপনার ধৈর্যের প্রশংসা করি।
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
