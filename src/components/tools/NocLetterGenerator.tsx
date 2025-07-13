
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NocLetterGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NOC Letter Generator</CardTitle>
        <CardDescription>
          এই টুলটি এখনো নির্মাণাধীন। শীঘ্রই আসছে!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
          টুল ইন্টারফেস এখানে যোগ করা হবে।
        </div>
      </CardContent>
    </Card>
  );
}
