
'use client';

import { useState, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';

interface BreakdownRow {
    year: number;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
}

const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const OneTimeInvestmentCalculator = () => {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [compounding, setCompounding] = useState(1); // Yearly
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6);
    const { toast } = useToast();
    const resultCardRef = useRef<HTMLDivElement>(null);

    const { futureValue, totalInvestment, totalInterest, realReturnValue, breakdown, chartData } = useMemo(() => {
        const p = Number(principal);
        const r = Number(rate) / 100;
        const t = Number(years);
        const n = Number(compounding);

        if (p <= 0 || r <= 0 || t <= 0) {
            return { futureValue: 0, totalInvestment: 0, totalInterest: 0, realReturnValue: 0, breakdown: [], chartData: [] };
        }

        const fv = p * Math.pow((1 + r / n), n * t);
        const totalInv = p;
        const totalInt = fv - totalInv;

        let realReturn = fv;
        if (adjustForInflation) {
            const i = Number(inflationRate) / 100;
            realReturn = fv / Math.pow((1 + i), t);
        }

        const breakdownData: BreakdownRow[] = [];
        const chartDataPoints: any[] = [{ year: 0, value: p }];
        let currentBalance = p;

        for (let i = 1; i <= t; i++) {
            const interestThisYear = currentBalance * (Math.pow(1 + r / n, n) - 1);
            const openingBalance = currentBalance;
            currentBalance += interestThisYear;
            breakdownData.push({
                year: i,
                openingBalance: openingBalance,
                interestEarned: interestThisYear,
                closingBalance: currentBalance
            });
            chartDataPoints.push({ year: i, value: Math.round(currentBalance) });
        }

        return {
            futureValue: Math.round(fv),
            totalInvestment: Math.round(totalInv),
            totalInterest: Math.round(totalInt),
            realReturnValue: Math.round(realReturn),
            breakdown: breakdownData,
            chartData: chartDataPoints
        };
    }, [principal, rate, years, compounding, adjustForInflation, inflationRate]);
    
    const handleShare = async () => {
        const element = resultCardRef.current;
        if (!element) {
            toast({ title: "ত্রুটি", description: "ফলাফল কার্ড খুঁজে পাওয়া যায়নি।", variant: "destructive" });
            return;
        }

        try {
            const canvas = await html2canvas(element, { 
                backgroundColor: 'hsl(var(--card))',
                scale: 2,
                useCORS: true,
            });
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast({ title: "ত্রুটি", description: "ছবি তৈরি করা সম্ভব হয়নি।", variant: "destructive" });
                    return;
                }
                
                const file = new File([blob], "investment-result.png", { type: "image/png" });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'আমার বিনিয়োগের ফলাফল',
                            text: 'আমার এককালীন বিনিয়োগের সম্ভাব্য ফলাফল দেখুন।',
                            files: [file],
                        });
                    } catch (err) {
                        if ((err as Error).name !== 'AbortError') {
                            console.error("Share failed:", err);
                             toast({ title: "শেয়ার ব্যর্থ হয়েছে", description: "শেয়ার করা সম্ভব হয়নি।", variant: "destructive" });
                        }
                    }
                } else {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'investment-result.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast({ title: "ডাউনলোড হয়েছে!", description: "ফলাফলের ছবিটি ডাউনলোড করা হয়েছে।" });
                }
            }, 'image/png');
        } catch (err) {
            console.error(err);
            toast({ title: "ত্রুটি", description: "ফলাফল শেয়ার বা ডাউনলোড করা সম্ভব হয়নি।", variant: "destructive" });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="principal">প্রাথমিক বিনিয়োগ (₹)</Label>
                    <Input id="principal" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[principal]} onValueChange={([val]) => setPrincipal(val)} max={10000000} step={10000} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="rate">বার্ষিক সুদের হার (%)</Label>
                    <Input id="rate" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[rate]} onValueChange={([val]) => setRate(val)} max={30} step={0.5} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="years">সময়কাল (বছর)</Label>
                    <Input id="years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[years]} onValueChange={([val]) => setYears(val)} max={40} step={1} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="compounding">চক্রবৃদ্ধির সময়কাল</Label>
                    <Select value={String(compounding)} onValueChange={val => setCompounding(Number(val))}>
                        <SelectTrigger id="compounding"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">বার্ষিক (Yearly)</SelectItem>
                            <SelectItem value="2">ষাণ্মাসিক (Half-Yearly)</SelectItem>
                            <SelectItem value="4">ত্রৈমাসিক (Quarterly)</SelectItem>
                            <SelectItem value="12">মাসিক (Monthly)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="inflation-switch" className="flex flex-col">
                                <span>মুদ্রাস্ফীতির সাথে সমন্বয়</span>
                                <span className="text-xs text-muted-foreground">Adjust for inflation</span>
                            </Label>
                            <Switch id="inflation-switch" checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                        </div>
                        {adjustForInflation && (
                             <div>
                                <Label htmlFor="inflationRate">প্রত্যাশিত মুদ্রাস্ফীতির হার (%)</Label>
                                <Input id="inflationRate" type="number" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="mt-1"/>
                                <Slider value={[inflationRate]} onValueChange={([val]) => setInflationRate(val)} max={15} step={0.1} className="mt-2" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div ref={resultCardRef} className="bg-card p-4 rounded-lg">
                    <Card className="w-full text-center bg-primary/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline">সম্ভাব্য ফলাফল</CardTitle>
                                 <Button variant="ghost" size="icon" onClick={handleShare}>
                                    <Share2 className="w-5 h-5"/>
                                    <span className="sr-only">ফলাফল শেয়ার করুন</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 rounded-lg bg-background">
                                    <p className="text-muted-foreground">মোট বিনিয়োগ</p>
                                    <p className="font-semibold text-lg">{formatCurrency(totalInvestment)}</p>
                                </div>
                                 <div className="p-2 rounded-lg bg-background">
                                    <p className="text-muted-foreground">মোট সুদ</p>
                                    <p className="font-semibold text-lg">{formatCurrency(totalInterest)}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10">
                                <p className="text-lg text-primary font-semibold">ভবিষ্যতের মোট মূল্য</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(futureValue)}</p>
                            </div>
                             {adjustForInflation && (
                                 <div className="p-2 rounded-lg bg-background text-sm">
                                    <p className="text-muted-foreground">মুদ্রাস্ফীতির পর প্রকৃত মূল্য</p>
                                    <p className="font-semibold text-lg">{formatCurrency(realReturnValue)}</p>
                                </div>
                             )}
                        </CardContent>
                    </Card>

                     {chartData.length > 1 && (
                        <Card className="mt-6">
                            <CardHeader><CardTitle className="text-lg font-headline">বিনিয়োগের বৃদ্ধি</CardTitle></CardHeader>
                            <CardContent className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Value"]} />
                                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

             {breakdown.length > 0 && (
                <div className="lg:col-span-2">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="breakdown">
                            <AccordionTrigger className="text-lg font-headline">বছর অনুযায়ী বিস্তারিত দেখুন</AccordionTrigger>
                            <AccordionContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>বছর</TableHead>
                                            <TableHead>শুরুর ব্যালেন্স</TableHead>
                                            <TableHead>অর্জিত সুদ</TableHead>
                                            <TableHead>শেষের ব্যালেন্স</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {breakdown.map(row => (
                                            <TableRow key={row.year}>
                                                <TableCell>{row.year}</TableCell>
                                                <TableCell>{formatCurrency(row.openingBalance)}</TableCell>
                                                <TableCell>{formatCurrency(row.interestEarned)}</TableCell>
                                                <TableCell>{formatCurrency(row.closingBalance)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    );
}

const SIPCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const { toast } = useToast();
    const resultCardRef = useRef<HTMLDivElement>(null);
    
    const { futureValue, totalInvestment, totalReturns, chartData } = useMemo(() => {
        const p = Number(monthlyInvestment);
        const r = Number(rate) / 100;
        const t = Number(years);
        
        if (p <= 0 || r <= 0 || t <= 0) {
            return { futureValue: 0, totalInvestment: 0, totalReturns: 0, chartData: [] };
        }

        const n = t * 12; // total number of installments
        const i = r / 12; // monthly interest rate

        const fv = p * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        const totalInv = p * n;
        const totalRet = fv - totalInv;
        
        const chartDataPoints: any[] = [{ year: 0, 'বিনিয়োগ': 0, 'মোট মূল্য': 0 }];
        let cumulativeInvestment = 0;
        let currentBalance = 0;

        for (let year = 1; year <= t; year++) {
            for(let month = 1; month <= 12; month++) {
                cumulativeInvestment += p;
                currentBalance = (currentBalance + p) * (1 + i);
            }
             chartDataPoints.push({
                year,
                'বিনিয়োগ': cumulativeInvestment,
                'মোট মূল্য': Math.round(currentBalance)
            });
        }

        return {
            futureValue: Math.round(fv),
            totalInvestment: Math.round(totalInv),
            totalReturns: Math.round(totalRet),
            chartData: chartDataPoints
        };
    }, [monthlyInvestment, rate, years]);
    
     const handleShare = async () => {
        const element = resultCardRef.current;
        if (!element) {
            toast({ title: "ত্রুটি", description: "ফলাফল কার্ড খুঁজে পাওয়া যায়নি।", variant: "destructive" });
            return;
        }

        try {
            const canvas = await html2canvas(element, { 
                backgroundColor: 'hsl(var(--card))',
                scale: 2,
                useCORS: true,
            });
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast({ title: "ত্রুটি", description: "ছবি তৈরি করা সম্ভব হয়নি।", variant: "destructive" });
                    return;
                }
                
                const file = new File([blob], "sip-result.png", { type: "image/png" });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'আমার SIP বিনিয়োগের ফলাফল',
                            text: 'আমার মাসিক বিনিয়োগের (SIP) সম্ভাব্য ফলাফল দেখুন।',
                            files: [file],
                        });
                    } catch (err) {
                        if ((err as Error).name !== 'AbortError') {
                            console.error("Share failed:", err);
                             toast({ title: "শেয়ার ব্যর্থ হয়েছে", description: "শেয়ার করা সম্ভব হয়নি।", variant: "destructive" });
                        }
                    }
                } else {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'sip-result.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast({ title: "ডাউনলোড হয়েছে!", description: "ফলাফলের ছবিটি ডাউনলোড করা হয়েছে।" });
                }
            }, 'image/png');
        } catch (err) {
            console.error(err);
            toast({ title: "ত্রুটি", description: "ফলাফল শেয়ার বা ডাউনলোড করা সম্ভব হয়নি।", variant: "destructive" });
        }
    };

     return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="monthly-investment">মাসিক বিনিয়োগ (₹)</Label>
                    <Input id="monthly-investment" type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[monthlyInvestment]} onValueChange={([val]) => setMonthlyInvestment(val)} max={100000} step={1000} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="sip-rate">প্রত্যাশিত বার্ষিক রিটার্ন (%)</Label>
                    <Input id="sip-rate" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[rate]} onValueChange={([val]) => setRate(val)} max={30} step={0.5} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="sip-years">সময়কাল (বছর)</Label>
                    <Input id="sip-years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[years]} onValueChange={([val]) => setYears(val)} max={40} step={1} className="mt-2" />
                </div>
            </div>
            <div className="space-y-6">
                <div ref={resultCardRef} className="bg-card p-4 rounded-lg">
                     <Card className="w-full text-center bg-primary/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline">সম্ভাব্য ফলাফল</CardTitle>
                                <Button variant="ghost" size="icon" onClick={handleShare}>
                                    <Share2 className="w-5 h-5"/>
                                    <span className="sr-only">ফলাফল শেয়ার করুন</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 rounded-lg bg-background">
                                    <p className="text-muted-foreground">মোট বিনিয়োগ</p>
                                    <p className="font-semibold text-lg">{formatCurrency(totalInvestment)}</p>
                                </div>
                                 <div className="p-2 rounded-lg bg-background">
                                    <p className="text-muted-foreground">মোট রিটার্ন</p>
                                    <p className="font-semibold text-lg">{formatCurrency(totalReturns)}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10">
                                <p className="text-lg text-primary font-semibold">ভবিষ্যতের মোট মূল্য</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(futureValue)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {chartData.length > 1 && (
                         <Card className="mt-6">
                            <CardHeader><CardTitle className="text-lg font-headline">বিনিয়োগ বনাম রিটার্ন</CardTitle></CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} unit=" বছর" />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), ""]} />
                                        <Area type="monotone" dataKey="বিনিয়োগ" stackId="1" name="মোট বিনিয়োগ" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                                        <Area type="monotone" dataKey="মোট মূল্য" stackId="1" name="মোট রিটার্ন" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
     );
}


export default function InvestmentReturnCalculator() {
    return (
        <Tabs defaultValue="onetime" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="onetime">এককালীন বিনিয়োগ</TabsTrigger>
                <TabsTrigger value="monthly">মাসিক বিনিয়োগ (SIP)</TabsTrigger>
            </TabsList>
            <TabsContent value="onetime">
                <OneTimeInvestmentCalculator />
            </TabsContent>
            <TabsContent value="monthly">
                <SIPCalculator />
            </TabsContent>
        </Tabs>
    );
}

