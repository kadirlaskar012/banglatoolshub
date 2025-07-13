'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export default function GstVatCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(15);
  const [type, setType] = useState<'inclusive' | 'exclusive'>('exclusive');

  const calc = () => {
    if (isNaN(amount) || isNaN(rate) || amount <= 0 || rate <= 0) {
      return { tax: 0, total: amount };
    }
    if (type === 'exclusive') {
      const tax = (amount * rate) / 100;
      const total = amount + tax;
      return { tax, total };
    } else { // inclusive
      const total = amount;
      const tax = amount - (amount * 100) / (100 + rate);
      return { tax, total };
    }
  };

  const { tax, total } = calc();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">পণ্যের মূল্য (টাকা)</Label>
          <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="rate">জিএসটি/ভ্যাট হার (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
        </div>
        <RadioGroup value={type} onValueChange={(val: 'inclusive' | 'exclusive') => setType(val)} className="flex space-x-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusive" id="exclusive" />
                <Label htmlFor="exclusive">কর ছাড়া (Exclusive)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusive" id="inclusive" />
                <Label htmlFor="inclusive">কর সহ (Inclusive)</Label>
            </div>
        </RadioGroup>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>হিসাবের ফলাফল</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span>পণ্যের আসল মূল্য:</span>
            <span className="font-semibold">৳{type === 'exclusive' ? amount.toLocaleString('bn-BD') : (total - tax).toLocaleString('bn-BD')}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span>জিএসটি/ভ্যাট:</span>
            <span className="font-semibold">৳{tax.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-2xl font-bold text-primary">
            <span>মোট মূল্য:</span>
            <span>৳{total.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
