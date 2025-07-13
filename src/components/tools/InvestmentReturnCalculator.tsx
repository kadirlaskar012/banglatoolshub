
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

type Language = 'bn' | 'en';

const translations = {
    bn: {
        onetime: "এককালীন বিনিয়োগ",
        monthly: "মাসিক বিনিয়োগ (SIP)",
        initialInvestment: "প্রাথমিক বিনিয়োগ",
        annualInterestRate: "বার্ষিক সুদের হার",
        timePeriod: "সময়কাল",
        years: "বছর",
        compoundingFrequency: "চক্রবৃদ্ধির সময়কাল",
        yearly: "বার্ষিক",
        halfYearly: "ষাণ্মাসিক",
        quarterly: "ত্রৈমাসিক",
        monthlyFreq: "মাসিক",
        adjustForInflation: "মুদ্রাস্ফীতির সাথে সমন্বয়",
        expectedInflationRate: "প্রত্যাশিত মুদ্রাস্ফীতির হার",
        potentialResults: "সম্ভাব্য ফলাফল",
        totalInvestment: "মোট বিনিয়োগ",
        totalInterest: "মোট সুদ",
        futureValue: "ভবিষ্যতের মোট মূল্য",
        realValueAfterInflation: "মুদ্রাস্ফীতির পর প্রকৃত মূল্য",
        share: "শেয়ার করুন",
        download: "ডাউনলোড করুন",
        investmentGrowth: "বিনিয়োগের বৃদ্ধি",
        seeYearlyBreakdown: "বছর অনুযায়ী বিস্তারিত দেখুন",
        year: "বছর",
        openingBalance: "শুরুর ব্যালেন্স",
        interestEarned: "অর্জিত সুদ",
        closingBalance: "শেষের ব্যালেন্স",
        shareTitleOneTime: "আমার এককালীন বিনিয়োগের ফলাফল",
        shareTextOneTime: "আমার এককালীন বিনিয়োগের ফলাফল:\n\n- মোট বিনিয়োগ: {totalInvestment}\n- মোট সুদ: {totalInterest}\n- ভবিষ্যতের মোট মূল্য: {futureValue}\n\nBangla Tools HUB থেকে হিসাব করা হয়েছে।",
        downloadTitleOneTime: "এককালীন বিনিয়োগের ফলাফল",
        downloadIntroOneTime: "প্রাথমিক তথ্য:",
        downloadResultOneTime: "ফলাফল:",
        downloadBreakdownTitle: "বছর অনুযায়ী বিস্তারিত হিসাব",
        toastCopied: "কপি হয়েছে!",
        toastCopiedDescription: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।",
        toastShareFailed: "শেয়ার ব্যর্থ হয়েছে",
        toastShareFailedDescription: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।",
        toastDownloaded: "ডাউনলোড হয়েছে!",
        toastDownloadedDescription: "ফলাফলের টেক্সট ফাইল ডাউনলোড করা হয়েছে।",
        monthlyInvestment: "মাসিক বিনিয়োগ",
        expectedAnnualReturn: "প্রত্যাশিত বার্ষিক রিটার্ন",
        totalReturns: "মোট রিটার্ন",
        investmentVsReturn: "বিনিয়োগ বনাম রিটার্ন",
        totalInvestmentChart: "মোট বিনিয়োগ",
        totalReturnsChart: "মোট রিটার্ন",
        shareTitleSIP: "আমার SIP বিনিয়োগের ফলাফল",
        shareTextSIP: "আমার মাসিক বিনিয়োগের (SIP) ফলাফল:\n\n- মোট বিনিয়োগ: {totalInvestment}\n- মোট রিটার্ন: {totalReturns}\n- ভবিষ্যতের মোট মূল্য: {futureValue}\n\nBangla Tools HUB থেকে হিসাব করা হয়েছে।",
        downloadTitleSIP: "মাসিক বিনিয়োগের (SIP) ফলাফল"
    },
    en: {
        onetime: "One-Time Investment",
        monthly: "Monthly Investment (SIP)",
        initialInvestment: "Initial Investment",
        annualInterestRate: "Annual Interest Rate",
        timePeriod: "Time Period",
        years: "Years",
        compoundingFrequency: "Compounding Frequency",
        yearly: "Yearly",
        halfYearly: "Half-Yearly",
        quarterly: "Quarterly",
        monthlyFreq: "Monthly",
        adjustForInflation: "Adjust for inflation",
        expectedInflationRate: "Expected Inflation Rate",
        potentialResults: "Potential Results",
        totalInvestment: "Total Investment",
        totalInterest: "Total Interest",
        futureValue: "Future Value",
        realValueAfterInflation: "Real Value After Inflation",
        share: "Share",
        download: "Download",
        investmentGrowth: "Investment Growth",
        seeYearlyBreakdown: "See Yearly Breakdown",
        year: "Year",
        openingBalance: "Opening Balance",
        interestEarned: "Interest Earned",
        closingBalance: "Closing Balance",
        shareTitleOneTime: "My One-Time Investment Result",
        shareTextOneTime: "My one-time investment result:\n\n- Total Investment: {totalInvestment}\n- Total Interest: {totalInterest}\n- Future Value: {futureValue}\n\nCalculated from Bangla Tools HUB.",
        downloadTitleOneTime: "One-Time Investment Result",
        downloadIntroOneTime: "Initial Information:",
        downloadResultOneTime: "Result:",
        downloadBreakdownTitle: "Year-wise Breakdown",
        toastCopied: "Copied!",
        toastCopiedDescription: "Result copied to clipboard.",
        toastShareFailed: "Share Failed",
        toastShareFailedDescription: "Result copied to clipboard.",
        toastDownloaded: "Downloaded!",
        toastDownloadedDescription: "Result text file has been downloaded.",
        monthlyInvestment: "Monthly Investment",
        expectedAnnualReturn: "Expected Annual Return",
        totalReturns: "Total Returns",
        investmentVsReturn: "Investment vs. Returns",
        totalInvestmentChart: "Total Investment",
        totalReturnsChart: "Total Returns",
        shareTitleSIP: "My SIP Investment Result",
        shareTextSIP: "My monthly investment (SIP) result:\n\n- Total Investment: {totalInvestment}\n- Total Returns: {totalReturns}\n- Future Value: {futureValue}\n\nCalculated from Bangla Tools HUB.",
        downloadTitleSIP: "Monthly Investment (SIP) Result"
    }
};

interface BreakdownRow {
    year: number;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
}

interface CalculatorProps {
    language: Language;
}

const OneTimeInvestmentCalculator = ({ language }: CalculatorProps) => {
    const t = translations[language];
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [compounding, setCompounding] = useState(1); // Yearly
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6);
    const { toast } = useToast();
    
    const formatCurrency = (value: number) => {
        return `₹${value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN', { maximumFractionDigits: 0 })}`;
    };

    const calculationResult = useMemo(() => {
        const p = Number(principal);
        const r = Number(rate) / 100;
        const t_years = Number(years);
        const n = Number(compounding);

        if (p <= 0 || r < 0 || t_years <= 0) {
            return { futureValue: 0, totalInvestment: 0, totalInterest: 0, realReturnValue: 0, breakdown: [], chartData: [] };
        }

        const fv = p * Math.pow((1 + r / n), n * t_years);
        const totalInv = p;
        const totalInt = fv - totalInv;

        let realReturn = fv;
        if (adjustForInflation) {
            const i = Number(inflationRate) / 100;
            realReturn = fv / Math.pow((1 + i), t_years);
        }

        const breakdownData: BreakdownRow[] = [];
        const chartDataPoints: any[] = [{ year: 0, value: p }];
        let currentBalance = p;

        for (let i = 1; i <= t_years; i++) {
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
        const shareText = t.shareTextOneTime
            .replace('{totalInvestment}', formatCurrency(totalInvestment))
            .replace('{totalInterest}', formatCurrency(totalInterest))
            .replace('{futureValue}', formatCurrency(futureValue));

        if (navigator.share) {
            try {
                await navigator.share({
                    title: t.shareTitleOneTime,
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                 if ((err as Error).name !== 'AbortError') {
                    console.error("Share failed:", err);
                    navigator.clipboard.writeText(shareText);
                    toast({ title: t.toastShareFailed, description: t.toastCopiedDescription });
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            toast({ title: t.toastCopied, description: t.toastCopiedDescription });
        }
    };

    const handleDownload = () => {
        const { futureValue, totalInvestment, totalInterest, breakdown } = calculationResult;

        let downloadText = `${t.downloadTitleOneTime}\n=========================\n\n`;
        downloadText += `${t.downloadIntroOneTime}\n`;
        downloadText += `- ${t.initialInvestment}: ${formatCurrency(principal)}\n`;
        downloadText += `- ${t.annualInterestRate}: ${rate}%\n`;
        downloadText += `- ${t.timePeriod}: ${years} ${t.years}\n\n`;
        
        downloadText += `${t.downloadResultOneTime}\n`;
        downloadText += `- ${t.totalInvestment}: ${formatCurrency(totalInvestment)}\n`;
        downloadText += `- ${t.interestEarned}: ${formatCurrency(totalInterest)}\n`;
        downloadText += `- ${t.futureValue}: ${formatCurrency(futureValue)}\n\n`;

        if (breakdown.length > 0) {
            downloadText += `${t.downloadBreakdownTitle}:\n--------------------------------------------------------------\n`;
            const header = `${t.year.padEnd(5)} | ${t.openingBalance.padEnd(20)} | ${t.interestEarned.padEnd(20)} | ${t.closingBalance.padEnd(20)}\n`;
            downloadText += header;
            downloadText += `--------------------------------------------------------------\n`;
            breakdown.forEach(row => {
                const yearStr = String(row.year).padEnd(5);
                const openingStr = formatCurrency(row.openingBalance).padEnd(20);
                const interestStr = formatCurrency(row.interestEarned).padEnd(20);
                const closingStr = formatCurrency(row.closingBalance).padEnd(20);
                downloadText += `${yearStr} | ${openingStr} | ${interestStr} | ${closingStr}\n`;
            });
        }
        
        const blob = new Blob(['\uFEFF' + downloadText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `investment-result-${language}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: t.toastDownloaded, description: t.toastDownloadedDescription });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="principal">{t.initialInvestment} (₹)</Label>
                    <Input id="principal" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[principal]} onValueChange={([val]) => setPrincipal(val)} max={10000000} step={10000} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="rate">{t.annualInterestRate} (%)</Label>
                    <Input id="rate" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[rate]} onValueChange={([val]) => setRate(val)} max={30} step={0.5} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="years">{t.timePeriod} ({t.years})</Label>
                    <Input id="years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[years]} onValueChange={([val]) => setYears(val)} max={40} step={1} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="compounding">{t.compoundingFrequency}</Label>
                    <Select value={String(compounding)} onValueChange={val => setCompounding(Number(val))}>
                        <SelectTrigger id="compounding"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">{t.yearly}</SelectItem>
                            <SelectItem value="2">{t.halfYearly}</SelectItem>
                            <SelectItem value="4">{t.quarterly}</SelectItem>
                            <SelectItem value="12">{t.monthlyFreq}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="inflation-switch" className="flex flex-col">
                                <span>{t.adjustForInflation}</span>
                            </Label>
                            <Switch id="inflation-switch" checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                        </div>
                        {adjustForInflation && (
                             <div>
                                <Label htmlFor="inflationRate">{t.expectedInflationRate} (%)</Label>
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
                        <CardTitle className="font-headline">{t.potentialResults}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">{t.totalInvestment}</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInvestment)}</p>
                            </div>
                                <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">{t.totalInterest}</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInterest)}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10">
                            <p className="text-lg text-primary font-semibold">{t.futureValue}</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculationResult.futureValue)}</p>
                        </div>
                            {adjustForInflation && (
                                <div className="p-2 rounded-lg bg-background text-sm">
                                <p className="text-muted-foreground">{t.realValueAfterInflation}</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.realReturnValue)}</p>
                            </div>
                            )}
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2"/>
                            {t.share}
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2"/>
                            {t.download}
                        </Button>
                    </CardFooter>
                </Card>
                
                {calculationResult.chartData.length > 1 && (
                    <Card>
                        <CardHeader><CardTitle className="text-lg font-headline">{t.investmentGrowth}</CardTitle></CardHeader>
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
                            <AccordionTrigger className="text-lg font-headline">{t.seeYearlyBreakdown}</AccordionTrigger>
                            <AccordionContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t.year}</TableHead>
                                            <TableHead>{t.openingBalance}</TableHead>
                                            <TableHead>{t.interestEarned}</TableHead>
                                            <TableHead>{t.closingBalance}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {calculationResult.breakdown.map(row => (
                                            <TableRow key={row.year}>
                                                <TableCell>{row.year.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN')}</TableCell>
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

const SIPCalculator = ({ language }: CalculatorProps) => {
    const t = translations[language];
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const { toast } = useToast();
    
    const formatCurrency = (value: number) => {
        return `₹${value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN', { maximumFractionDigits: 0 })}`;
    };

    const calculationResult = useMemo(() => {
        const p = Number(monthlyInvestment);
        const r = Number(rate) / 100;
        const t_years = Number(years);
        
        if (p <= 0 || r < 0 || t_years <= 0) {
            return { futureValue: 0, totalInvestment: 0, totalReturns: 0, chartData: [], breakdown: [] };
        }

        const n = t_years * 12; // total number of installments
        const i = r / 12; // monthly interest rate

        const fv = p * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        const totalInv = p * n;
        const totalRet = fv - totalInv;
        
        const chartDataPoints: any[] = [{ year: 0, [t.totalInvestmentChart]: 0, [t.totalReturnsChart]: 0 }];
        const breakdownData: BreakdownRow[] = [];
        let cumulativeInvestment = 0;
        let currentBalance = 0;

        for (let year = 1; year <= t_years; year++) {
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
                [t.totalInvestmentChart]: cumulativeInvestment,
                [t.totalReturnsChart]: Math.round(currentBalance)
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
    }, [monthlyInvestment, rate, years, language, t.totalInvestmentChart, t.totalReturnsChart]);
    
    const handleShare = async () => {
        const { futureValue, totalInvestment, totalReturns } = calculationResult;
        const shareText = t.shareTextSIP
            .replace('{totalInvestment}', formatCurrency(totalInvestment))
            .replace('{totalReturns}', formatCurrency(totalReturns))
            .replace('{futureValue}', formatCurrency(futureValue));

        if (navigator.share) {
            try {
                await navigator.share({
                    title: t.shareTitleSIP,
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                 if ((err as Error).name !== 'AbortError') {
                    console.error("Share failed:", err);
                    navigator.clipboard.writeText(shareText);
                    toast({ title: t.toastShareFailed, description: t.toastCopiedDescription });
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            toast({ title: t.toastCopied, description: t.toastCopiedDescription });
        }
    };

    const handleDownload = () => {
        const { futureValue, totalInvestment, totalReturns, breakdown } = calculationResult;

        let downloadText = `${t.downloadTitleSIP}\n=========================\n\n`;
        downloadText += `${t.downloadIntroOneTime}\n`;
        downloadText += `- ${t.monthlyInvestment}: ${formatCurrency(monthlyInvestment)}\n`;
        downloadText += `- ${t.expectedAnnualReturn}: ${rate}%\n`;
        downloadText += `- ${t.timePeriod}: ${years} ${t.years}\n\n`;
        
        downloadText += `${t.downloadResultOneTime}\n`;
        downloadText += `- ${t.totalInvestment}: ${formatCurrency(totalInvestment)}\n`;
        downloadText += `- ${t.totalReturns}: ${formatCurrency(totalReturns)}\n`;
        downloadText += `- ${t.futureValue}: ${formatCurrency(futureValue)}\n\n`;

        if (breakdown.length > 0) {
            downloadText += `${t.downloadBreakdownTitle}:\n--------------------------------------------------------------\n`;
            const header = `${t.year.padEnd(5)} | ${t.openingBalance.padEnd(20)} | ${t.interestEarned.padEnd(20)} | ${t.closingBalance.padEnd(20)}\n`;
            downloadText += header;
            downloadText += `--------------------------------------------------------------\n`;

            breakdown.forEach(row => {
                const yearStr = String(row.year).padEnd(5);
                const openingStr = formatCurrency(row.openingBalance).padEnd(20);
                const interestStr = formatCurrency(row.interestEarned).padEnd(20);
                const closingStr = formatCurrency(row.closingBalance).padEnd(20);
                downloadText += `${yearStr} | ${openingStr} | ${interestStr} | ${closingStr}\n`;
            });
        }
        
        const blob = new Blob(['\uFEFF' + downloadText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sip-result-${language}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: t.toastDownloaded, description: t.toastDownloadedDescription });
    };

     return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="monthly-investment">{t.monthlyInvestment} (₹)</Label>
                    <Input id="monthly-investment" type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[monthlyInvestment]} onValueChange={([val]) => setMonthlyInvestment(val)} max={100000} step={1000} className="mt-2" />
                </div>
                 <div>
                    <Label htmlFor="sip-rate">{t.expectedAnnualReturn} (%)</Label>
                    <Input id="sip-rate" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[rate]} onValueChange={([val]) => setRate(val)} max={30} step={0.5} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="sip-years">{t.timePeriod} ({t.years})</Label>
                    <Input id="sip-years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="text-lg"/>
                    <Slider value={[years]} onValueChange={([val]) => setYears(val)} max={40} step={1} className="mt-2" />
                </div>
            </div>
            <div className="space-y-6">
                <Card className="w-full text-center bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline">{t.potentialResults}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">{t.totalInvestment}</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalInvestment)}</p>
                            </div>
                                <div className="p-2 rounded-lg bg-background">
                                <p className="text-muted-foreground">{t.totalReturns}</p>
                                <p className="font-semibold text-lg">{formatCurrency(calculationResult.totalReturns)}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10">
                            <p className="text-lg text-primary font-semibold">{t.futureValue}</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculationResult.futureValue)}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2"/>
                            {t.share}
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2"/>
                            {t.download}
                        </Button>
                    </CardFooter>
                </Card>

                {calculationResult.chartData.length > 1 && (
                        <Card>
                        <CardHeader><CardTitle className="text-lg font-headline">{t.investmentVsReturn}</CardTitle></CardHeader>
                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={calculationResult.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} unit={` ${t.year}`} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 100000}L`} />
                                    <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                                    <Area type="monotone" dataKey={t.totalInvestmentChart} stackId="1" name={t.totalInvestmentChart} stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                                    <Area type="monotone" dataKey={t.totalReturnsChart} stackId="1" name={t.totalReturnsChart} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
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
                            <AccordionTrigger className="text-lg font-headline">{t.seeYearlyBreakdown}</AccordionTrigger>
                            <AccordionContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t.year}</TableHead>
                                            <TableHead>{t.openingBalance}</TableHead>
                                            <TableHead>{t.interestEarned}</TableHead>
                                            <TableHead>{t.closingBalance}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {calculationResult.breakdown.map(row => (
                                            <TableRow key={row.year}>
                                                <TableCell>{row.year.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN')}</TableCell>
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


export default function InvestmentReturnCalculator() {
    const [language, setLanguage] = useState<Language>('bn');
    const t = translations[language];

    return (
        <div className="w-full space-y-4">
            <Tabs defaultValue="bn" onValueChange={(value) => setLanguage(value as Language)}>
                <TabsList className="grid w-fit grid-cols-2 mb-6">
                    <TabsTrigger value="bn">বাংলা</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
            </Tabs>
        
            <Tabs defaultValue="onetime" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="onetime">{t.onetime}</TabsTrigger>
                    <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
                </TabsList>
                <TabsContent value="onetime">
                    <OneTimeInvestmentCalculator language={language} />
                </TabsContent>
                <TabsContent value="monthly">
                    <SIPCalculator language={language} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
