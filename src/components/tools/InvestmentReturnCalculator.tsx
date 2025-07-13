'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InvestmentReturnCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [type, setType] = useState('onetime'); // onetime vs monthly
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);

  const { futureValue, totalInvestment, totalReturns } = useMemo(() => {
    let fv = 0;
    let totalInv = 0;

    if (type === 'onetime') {
      totalInv = amount;
      fv = amount * Math.pow(1 + rate / 100, years);
    } else { // SIP
      totalInv = monthlyInvestment * years * 12;
      const i = rate / 100 / 12;
      const n = years * 12;
      fv = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    
    const totalRet = fv - totalInv;
    return { futureValue: Math.round(fv), totalInvestment: Math.round(totalInv), totalReturns: Math.round(totalRet) };
  }, [amount, rate, years, type, monthlyInvestment]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label>বিনিয়োগের ধরন</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="ধরন নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onetime">এককালীন বিনিয়োগ</SelectItem>
              <SelectItem value="monthly">মাসিক বিনিয়োগ (SIP)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === 'onetime' ? (
          <div>
            <Label htmlFor="onetime-amount">মোট বিনিয়োগের পরিমাণ (টাকা)</Label>
            <Input id="onetime-amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </div>
        ) : (
          <div>
            <Label htmlFor="monthly-amount">মাসিক বিনিয়োগের পরিমাণ (টাকা)</Label>
            <Input id="monthly-amount" type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))} />
          </div>
        )}

        <div>
          <Label htmlFor="rate">প্রত্যাশিত বার্ষিক রিটার্ন (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="years">সময়কাল (বছর)</Label>
          <Input id="years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full text-center bg-secondary/30">
          <CardHeader>
            <CardTitle>সম্ভাব্য ফলাফল</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-2">
                <p className="text-sm text-muted-foreground">মোট বিনিয়োগ</p>
                <p className="text-2xl font-semibold">৳{totalInvestment.toLocaleString('bn-BD')}</p>
            </div>
             <div className="p-2">
                <p className="text-sm text-muted-foreground">মোট রিটার্ন</p>
                <p className="text-2xl font-semibold">৳{totalReturns.toLocaleString('bn-BD')}</p>
            </div>
             <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-lg text-primary">ভবিষ্যতের মোট মূল্য</p>
                <p className="text-4xl font-bold text-primary">৳{futureValue.toLocaleString('bn-BD')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
