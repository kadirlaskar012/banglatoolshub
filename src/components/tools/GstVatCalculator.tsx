
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const PRESET_RATES = ['5', '12', '18', '28'];

export default function GstVatCalculator() {
  const [amount, setAmount] = useState<number | string>(1000);
  const [rate, setRate] = useState<number | string>('18');
  const [customRate, setCustomRate] = useState<number | string>('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
  };
  
  const handleRateChange = (value: string) => {
    if (value === 'custom') {
      setRate('custom');
    } else {
      setRate(parseFloat(value));
      setCustomRate('');
    }
  };

  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomRate(value);
    setRate('custom');
  };
  
  const currentRate = useMemo(() => {
    const r = rate === 'custom' ? customRate : rate;
    const parsedRate = parseFloat(String(r));
    return isNaN(parsedRate) ? 0 : parsedRate;
  }, [rate, customRate]);

  const parsedAmount = useMemo(() => {
      const parsed = parseFloat(String(amount));
      return isNaN(parsed) ? 0 : parsed;
  }, [amount])

  const { taxAmount, priceWithoutTax, finalPrice } = useMemo(() => {
    if (parsedAmount <= 0 || currentRate <= 0) {
      return { taxAmount: 0, priceWithoutTax: parsedAmount, finalPrice: parsedAmount };
    }

    if (mode === 'add') { // Exclusive calculation
      const tax = (parsedAmount * currentRate) / 100;
      return {
        taxAmount: tax,
        priceWithoutTax: parsedAmount,
        finalPrice: parsedAmount + tax,
      };
    } else { // Inclusive calculation
      const originalPrice = (parsedAmount * 100) / (100 + currentRate);
      const tax = parsedAmount - originalPrice;
      return {
        taxAmount: tax,
        priceWithoutTax: originalPrice,
        finalPrice: parsedAmount,
      };
    }
  }, [parsedAmount, currentRate, mode]);

  const formatCurrency = (value: number) => {
    return `৳ ${value.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <Tabs value={mode} onValueChange={(value) => setMode(value as 'add' | 'remove')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">জিএসটি যোগ করুন</TabsTrigger>
                <TabsTrigger value="remove">জিএসটি বাদ দিন</TabsTrigger>
            </TabsList>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <Card className="border-none shadow-none">
                    <CardContent className="p-1 space-y-6">
                         <div>
                            <Label htmlFor="amount" className="text-base">
                                {mode === 'add' ? 'পণ্যের আসল মূল্য লিখুন' : 'মোট মূল্য লিখুন'}
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleAmountChange}
                                className="mt-2 text-lg h-12"
                            />
                        </div>
                        <div>
                            <Label htmlFor="rate" className="text-base">জিএসটি/ভ্যাট হার (%)</Label>
                            <div className="flex gap-2 mt-2">
                                <Select onValueChange={handleRateChange} value={String(rate)}>
                                    <SelectTrigger className="text-lg h-12 flex-1">
                                        <SelectValue placeholder="হার নির্বাচন করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRESET_RATES.map((r) => (
                                            <SelectItem key={r} value={r}>{r}%</SelectItem>
                                        ))}
                                        <SelectItem value="custom">অন্যান্য (Custom)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {rate === 'custom' && (
                                    <Input
                                        type="number"
                                        placeholder="%"
                                        value={customRate}
                                        onChange={handleCustomRateChange}
                                        className="text-lg h-12 w-24"
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline">হিসাবের ফলাফল</CardTitle>
                        <CardDescription>আপনার দেওয়া তথ্যের উপর ভিত্তি করে ফলাফল নিচে দেওয়া হলো।</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-lg">
                        <div className="flex justify-between items-center">
                            <span>আসল মূল্য:</span>
                            <span className="font-semibold">{formatCurrency(priceWithoutTax)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>জিএসটি/ভ্যাট:</span>
                            <span className="font-semibold">{formatCurrency(taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-2xl font-bold text-primary">
                            <span>মোট মূল্য:</span>
                            <span>{formatCurrency(finalPrice)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Tabs>
    </div>
  );
}
