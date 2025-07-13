
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
import { Share2, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    
    const calculationResult = useMemo(() => {
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
        const { futureValue, totalInvestment, totalInterest } = calculationResult;
        const shareText = `আমার এককালীন বিনিয়োগের ফলাফল:\n\n- মোট বিনিয়োগ: ${formatCurrency(totalInvestment)}\n- মোট সুদ: ${formatCurrency(totalInterest)}\n- ভবিষ্যতের মোট মূল্য: ${formatCurrency(futureValue)}\n\nBangla Tools HUB থেকে হিসাব করা হয়েছে।`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'আমার বিনিয়োগের ফলাফল',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                 if ((err as Error).name !== 'AbortError') {
                    console.error("Share failed:", err);
                    navigator.clipboard.writeText(shareText);
                    toast({ title: "শেয়ার ব্যর্থ হয়েছে", description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।" });
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            toast({ title: "কপি হয়েছে!", description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।" });
        }
    };

    const handleDownload = () => {
        const { futureValue, totalInvestment, totalInterest, breakdown } = calculationResult;

        let downloadText = `এককালীন বিনিয়োগের ফলাফল\n=========================\n\n`;
        downloadText += `প্রাথমিক তথ্য:\n`;
        downloadText += `- প্রাথমিক বিনিয়োগ: ${formatCurrency(principal)}\n`;
        downloadText += `- বার্ষিক সুদের হার: ${rate}%\n`;
        downloadText += `- সময়কাল: ${years} বছর\n\n`;
        
        downloadText += `ফলাফল:\n`;
        downloadText += `- মোট বিনিয়োগ: ${formatCurrency(totalInvestment)}\n`;
        downloadText += `- মোট অর্জিত সুদ: ${formatCurrency(totalInterest)}\n`;
        downloadText += `- ভবিষ্যতের মোট মূল্য: ${formatCurrency(futureValue)}\n\n`;

        if (breakdown.length > 0) {
            downloadText += `বছর অনুযায়ী বিস্তারিত হিসাব:\n-----------------------------\n`;
            downloadText += `বছর\tশুরুর ব্যালেন্স\tঅর্জিত সুদ\tশেষের ব্যালেন্স\n`;
            breakdown.forEach(row => {
                downloadText += `${row.year}\t${formatCurrency(row.openingBalance)}\t${formatCurrency(row.interestEarned)}\t${formatCurrency(row.closingBalance)}\n`;
            });
        }
        
        const blob = new Blob([downloadText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'investment-result.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: "ডাউনলোড হয়েছে!", description: "ফলাফলের টেক্সট ফাইল ডাউনলোড করা হয়েছে।" });
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
                <Card className="w-full text-center bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline">সম্ভাব্য ফলাফল</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">মোট বিনিয়োগ</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInvestment)}</p>
                            </div>
                                <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">মোট সুদ</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInterest)}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10">
                            <p className="text-lg text-primary font-semibold">ভবিষ্যতের মোট মূল্য</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculationResult.futureValue)}</p>
                        </div>
                            {adjustForInflation && (
                                <div className="p-2 rounded-lg bg-background text-sm">
                                <p className="text-muted-foreground">মুদ্রাস্ফীতির পর প্রকৃত মূল্য</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.realReturnValue)}</p>
                            </div>
                            )}
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2"/>
                            শেয়ার করুন
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2"/>
                            ডাউনলোড করুন
                        </Button>
                    </CardFooter>
                </Card>
                
                {calculationResult.chartData.length > 1 && (
                    <Card>
                        <CardHeader><CardTitle className="text-lg font-headline">বিনিয়োগের বৃদ্ধি</CardTitle></CardHeader>
                        <CardContent className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={calculationResult.chartData}>
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

             {calculationResult.breakdown.length > 0 && (
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
                                        {calculationResult.breakdown.map(row => (
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
    
    const calculationResult = useMemo(() => {
        const p = Number(monthlyInvestment);
        const r = Number(rate) / 100;
        const t = Number(years);
        
        if (p <= 0 || r <= 0 || t <= 0) {
            return { futureValue: 0, totalInvestment: 0, totalReturns: 0, chartData: [], breakdown: [] };
        }

        const n = t * 12; // total number of installments
        const i = r / 12; // monthly interest rate

        const fv = p * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        const totalInv = p * n;
        const totalRet = fv - totalInv;
        
        const chartDataPoints: any[] = [{ year: 0, 'বিনিয়োগ': 0, 'মোট মূল্য': 0 }];
        const breakdownData: BreakdownRow[] = [];
        let cumulativeInvestment = 0;
        let currentBalance = 0;

        for (let year = 1; year <= t; year++) {
            const openingBalanceYear = currentBalance;
            let interestThisYear = 0;
            for(let month = 1; month <= 12; month++) {
                const interestThisMonth = (currentBalance + p) * i;
                interestThisYear += interestThisMonth;
                currentBalance = (currentBalance + p) * (1 + i);
                cumulativeInvestment += p;
            }
             chartDataPoints.push({
                year,
                'বিনিয়োগ': cumulativeInvestment,
                'মোট মূল্য': Math.round(currentBalance)
            });
            breakdownData.push({
                year: year,
                openingBalance: openingBalanceYear,
                interestEarned: interestThisYear,
                closingBalance: currentBalance,
            });
        }

        return {
            futureValue: Math.round(fv),
            totalInvestment: Math.round(totalInv),
            totalReturns: Math.round(totalRet),
            chartData: chartDataPoints,
            breakdown: breakdownData,
        };
    }, [monthlyInvestment, rate, years]);
    
    const handleShare = async () => {
        const { futureValue, totalInvestment, totalReturns } = calculationResult;
        const shareText = `আমার মাসিক বিনিয়োগের (SIP) ফলাফল:\n\n- মোট বিনিয়োগ: ${formatCurrency(totalInvestment)}\n- মোট রিটার্ন: ${formatCurrency(totalReturns)}\n- ভবিষ্যতের মোট মূল্য: ${formatCurrency(futureValue)}\n\nBangla Tools HUB থেকে হিসাব করা হয়েছে।`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'আমার SIP বিনিয়োগের ফলাফল',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                 if ((err as Error).name !== 'AbortError') {
                    console.error("Share failed:", err);
                    navigator.clipboard.writeText(shareText);
                    toast({ title: "শেয়ার ব্যর্থ হয়েছে", description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।" });
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            toast({ title: "কপি হয়েছে!", description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।" });
        }
    };

    const handleDownload = () => {
        const { futureValue, totalInvestment, totalReturns, breakdown } = calculationResult;

        let downloadText = `মাসিক বিনিয়োগের (SIP) ফলাফল\n=========================\n\n`;
        downloadText += `প্রাথমিক তথ্য:\n`;
        downloadText += `- মাসিক বিনিয়োগ: ${formatCurrency(monthlyInvestment)}\n`;
        downloadText += `- প্রত্যাশিত বার্ষিক রিটার্ন: ${rate}%\n`;
        downloadText += `- সময়কাল: ${years} বছর\n\n`;
        
        downloadText += `ফলাফল:\n`;
        downloadText += `- মোট বিনিয়োগ: ${formatCurrency(totalInvestment)}\n`;
        downloadText += `- মোট অর্জিত রিটার্ন: ${formatCurrency(totalReturns)}\n`;
        downloadText += `- ভবিষ্যতের মোট মূল্য: ${formatCurrency(futureValue)}\n\n`;

        if (breakdown.length > 0) {
            downloadText += `বছর অনুযায়ী বিস্তারিত হিসাব:\n-----------------------------\n`;
            downloadText += `বছর\tশুরুর ব্যালেন্স\tঅর্জিত সুদ\tশেষের ব্যালেন্স\n`;
            breakdown.forEach(row => {
                downloadText += `${row.year}\t${formatCurrency(row.openingBalance)}\t${formatCurrency(row.interestEarned)}\t${formatCurrency(row.closingBalance)}\n`;
            });
        }
        
        const blob = new Blob([downloadText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sip-result.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: "ডাউনলোড হয়েছে!", description: "ফলাফলের টেক্সট ফাইল ডাউনলোড করা হয়েছে।" });
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
                <Card className="w-full text-center bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline">সম্ভাব্য ফলাফল</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">মোট বিনিয়োগ</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInvestment)}</p>
                            </div>
                                <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">মোট রিটার্ন</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalReturns)}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10">
                            <p className="text-lg text-primary font-semibold">ভবিষ্যতের মোট মূল্য</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculationResult.futureValue)}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2"/>
                            শেয়ার করুন
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2"/>
                            ডাউনলোড করুন
                        </Button>
                    </CardFooter>
                </Card>

                {calculationResult.chartData.length > 1 && (
                        <Card>
                        <CardHeader><CardTitle className="text-lg font-headline">বিনিয়োগ বনাম রিটার্ন</CardTitle></CardHeader>
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={calculationResult.chartData}>
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
