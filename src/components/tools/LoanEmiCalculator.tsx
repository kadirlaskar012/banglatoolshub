'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function LoanEmiCalculator() {
  const [amount, setAmount] = useState(100000);
  const [interest, setInterest] = useState(10);
  const [tenure, setTenure] = useState(5);

  const emi = useMemo(() => {
    const principal = amount;
    const rate = interest / 12 / 100;
    const time = tenure * 12;

    if (principal <= 0 || rate <= 0 || time <= 0) return 0;

    const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    return Math.round(emiValue);
  }, [amount, interest, tenure]);

  const totalPayable = useMemo(() => emi * tenure * 12, [emi, tenure]);
  const totalInterest = useMemo(() => totalPayable - amount, [totalPayable, amount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="amount">লোনের পরিমাণ (টাকা)</Label>
          <Input id="amount" value={amount.toLocaleString('bn-BD')} onChange={e => setAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-bold" />
          <Slider value={[amount]} onValueChange={([val]) => setAmount(val)} max={5000000} step={10000} className="mt-2"/>
        </div>
        <div>
          <Label htmlFor="interest">বার্ষিক সুদের হার (%)</Label>
          <Input id="interest" type="number" value={interest} onChange={e => setInterest(Number(e.target.value))} className="text-lg font-bold" />
          <Slider value={[interest]} onValueChange={([val]) => setInterest(val)} max={20} step={0.1} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="tenure">মেয়াদ (বছর)</Label>
          <Input id="tenure" type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="text-lg font-bold" />
           <Slider value={[tenure]} onValueChange={([val]) => setTenure(val)} max={30} step={1} className="mt-2" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>আপনার মাসিক কিস্তি (EMI)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-primary">৳{emi.toLocaleString('bn-BD')}</p>
            <div className="text-muted-foreground space-y-2">
                <p>মোট সুদ: ৳{totalInterest.toLocaleString('bn-BD')}</p>
                <p>মোট পরিশোধযোগ্য: ৳{totalPayable.toLocaleString('bn-BD')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
