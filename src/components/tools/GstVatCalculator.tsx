
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, IndianRupee, Percent, Hash, Share2, History, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import html2canvas from 'html2canvas';

const PRESET_RATES = ['5', '12', '18', '28'];
const GST_CATEGORIES = {
    'essential': { name: 'অত্যাবশ্যকীয় পণ্য (চাল, ডাল)', rate: 0 },
    'common': { name: 'সাধারণ ব্যবহার্য (চিনি, চা)', rate: 5 },
    'standard-1': { name: 'প্রক্রিয়াজাত খাবার, কম্পিউটার', rate: 12 },
    'standard-2': { name: 'ইলেকট্রনিক্স, সাবান, টুথপেস্ট', rate: 18 },
    'luxury': { name: 'বিলাসপণ্য, গাড়ি', rate: 28 },
};

interface CalculationItem {
    id: number;
    amount: number | string;
    rate: number | string;
}

interface HistoryItem {
    id: string;
    items: CalculationItem[];
    mode: 'add' | 'remove';
    country: 'india' | 'bangladesh';
    transactionType: 'intra' | 'inter';
    timestamp: string;
    totalPrice: number;
}

const getInitialItems = (): CalculationItem[] => [{ id: 1, amount: 1000, rate: '18' }];

export default function GstVatCalculator() {
    const [items, setItems] = useState<CalculationItem[]>(getInitialItems);
    const [mode, setMode] = useState<'add' | 'remove'>('add');
    const [country, setCountry] = useState<'india' | 'bangladesh'>('india');
    const [transactionType, setTransactionType] = useState<'intra' | 'inter'>('intra');
    const { toast } = useToast();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const resultCardRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('gstHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
        }
    }, []);

    const saveHistoryToLocalStorage = (updatedHistory: HistoryItem[]) => {
        try {
            localStorage.setItem('gstHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    };
    
    const saveToHistory = useCallback((calcResult: any) => {
        if (!calcResult || typeof calcResult.finalPrice === 'undefined' || calcResult.finalPrice === 0) return;

        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString(),
            items,
            mode,
            country,
            transactionType,
            timestamp: new Date().toLocaleString('bn-BD'),
            totalPrice: calcResult.finalPrice,
        };
        
        setHistory(prevHistory => {
            const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 5);
            saveHistoryToLocalStorage(updatedHistory);
            return updatedHistory;
        });
    }, [items, mode, country, transactionType]);


    const handleItemChange = (id: number, field: 'amount' | 'rate', value: string) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    if (field === 'rate' && Object.keys(GST_CATEGORIES).includes(value)) {
                        const categoryRate = GST_CATEGORIES[value as keyof typeof GST_CATEGORIES].rate;
                        return { ...item, rate: String(categoryRate) };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), amount: 0, rate: country === 'india' ? '18' : '15' }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const totalCalculation = useMemo(() => {
        let totalTaxableValue = 0;
        let totalTaxAmount = 0;

        items.forEach(item => {
            const parsedAmount = parseFloat(String(item.amount)) || 0;
            const parsedRate = parseFloat(String(item.rate)) || 0;

            if (parsedAmount > 0 && parsedRate >= 0) {
                if (mode === 'add') {
                    const tax = (parsedAmount * parsedRate) / 100;
                    totalTaxableValue += parsedAmount;
                    totalTaxAmount += tax;
                } else { // remove
                    const originalPrice = (parsedAmount * 100) / (100 + parsedRate);
                    const tax = parsedAmount - originalPrice;
                    totalTaxableValue += originalPrice;
                    totalTaxAmount += tax;
                }
            }
        });

        const finalPrice = totalTaxableValue + totalTaxAmount;
        
        return {
            totalTaxableValue,
            totalTaxAmount,
            finalPrice,
            cgst: country === 'india' && transactionType === 'intra' ? totalTaxAmount / 2 : 0,
            sgst: country === 'india' && transactionType === 'intra' ? totalTaxAmount / 2 : 0,
            igst: country === 'india' && transactionType === 'inter' ? totalTaxAmount : 0,
        };
    }, [items, mode, transactionType, country]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if (totalCalculation.finalPrice > 0) {
              saveToHistory(totalCalculation);
            }
        }, 2000);
        return () => clearTimeout(handler);
    }, [items, mode, transactionType, country, saveToHistory, totalCalculation]);

    const formatCurrency = (value: number) => {
        if (value === null || typeof value === 'undefined') {
          return `0.00 টাকা`;
        }
        return `${value.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} টাকা`;
      };
    
    const handleShare = async () => {
        const { totalTaxableValue, totalTaxAmount, finalPrice, cgst, sgst, igst } = totalCalculation;
        const resultText = `
জিএসটি/ভ্যাট হিসাবের ফলাফল:
---------------------
করযোগ্য মূল্য: ${formatCurrency(totalTaxableValue)}
মোট কর: ${formatCurrency(totalTaxAmount)}
${country === 'india' && transactionType === 'intra' ? `CGST: ${formatCurrency(cgst)}\nSGST: ${formatCurrency(sgst)}` : ''}
${country === 'india' && transactionType === 'inter' ? `IGST: ${formatCurrency(igst)}` : ''}
---------------------
মোট মূল্য: ${formatCurrency(finalPrice)}

Bangla Tools HUB থেকে হিসাব করা হয়েছে।
        `.trim();
        
        const element = resultCardRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { 
                backgroundColor: null, // Makes background transparent if the element has no bg color
                scale: 2 // Increases resolution
            });
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    throw new Error("Canvas to Blob conversion failed");
                }
                
                const file = new File([blob], "gst-vat-calculation.png", { type: "image/png" });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'জিএসটি/ভ্যাট হিসাব',
                        text: 'আমার জিএসটি/ভ্যাট হিসাবের ফলাফল দেখুন।',
                        files: [file],
                    });
                } else {
                    // Fallback for browsers that don't support sharing files
                    await navigator.share({
                        title: 'জিএসটি/ভ্যাট হিসাব',
                        text: resultText,
                        url: window.location.href,
                    });
                }
            });
        } catch (err) {
            // Fallback to text sharing if image generation or sharing fails
            try {
                await navigator.share({
                    title: 'জিএসটি/ভ্যাট হিসাব',
                    text: resultText,
                    url: window.location.href,
                });
            } catch (shareErr) {
                // If even text sharing fails, copy to clipboard
                navigator.clipboard.writeText(resultText);
                toast({
                    title: "কপি হয়েছে!",
                    description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।",
                });
            }
        }
    };
    
    const loadFromHistory = (historyItem: HistoryItem) => {
        setItems(historyItem.items);
        setMode(historyItem.mode);
        setCountry(historyItem.country);
        setTransactionType(historyItem.transactionType);
        toast({ title: "ইতিহাস লোড হয়েছে" });
    };

    const deleteHistoryItem = (id: string) => {
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.filter(item => item.id !== id);
            saveHistoryToLocalStorage(updatedHistory);
            return updatedHistory;
        });
        toast({ title: "হিস্টোরি আইটেম মুছে ফেলা হয়েছে" });
    };

    const clearHistory = () => {
        setHistory([]);
        saveHistoryToLocalStorage([]);
        toast({ title: "সম্পূর্ণ হিস্টোরি মুছে ফেলা হয়েছে" });
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <Tabs value={country} onValueChange={(value) => setCountry(value as 'india' | 'bangladesh')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="india" className="flex items-center gap-2">
                        <span role="img" aria-label="India flag">🇮🇳</span>
                        ভারত (India)
                    </TabsTrigger>
                    <TabsTrigger value="bangladesh" className="flex items-center gap-2">
                        <span role="img" aria-label="Bangladesh flag">🇧🇩</span>
                        বাংলাদেশ (Bangladesh)
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'add' | 'remove')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="add">জিএসটি যোগ করুন (Exclusive)</TabsTrigger>
                    <TabsTrigger value="remove">জিএসটি বাদ দিন (Inclusive)</TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <Card className="border-none shadow-none p-0">
                        <CardContent className="p-1 space-y-4">
                            {items.map((item, index) => (
                                <Card key={item.id} className="p-4 relative bg-muted/30">
                                     <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1">
                                                <Label htmlFor={`amount-${item.id}`} className="text-sm">
                                                    {mode === 'add' ? 'পণ্যের আসল মূল্য' : 'মোট মূল্য'}
                                                </Label>
                                                <Input
                                                    id={`amount-${item.id}`}
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={item.amount}
                                                    onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor={`rate-${item.id}`} className="text-sm">জিএসটি/ভ্যাট হার (%)</Label>
                                                <Select
                                                    onValueChange={(value) => handleItemChange(item.id, 'rate', value)}
                                                    value={String(item.rate)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="হার নির্বাচন করুন" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>সাধারণ হার</SelectLabel>
                                                            {PRESET_RATES.map((r) => (
                                                                <SelectItem key={r} value={r}>{r}%</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                        {country === 'india' && (
                                                            <SelectGroup>
                                                                <SelectLabel>ক্যাটাগরি অনুযায়ী</SelectLabel>
                                                                {Object.entries(GST_CATEGORIES).map(([key, value]) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {value.name} ({value.rate}%)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </Card>
                            ))}
                             <Button variant="outline" onClick={addItem} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> নতুন আইটেম যোগ করুন
                            </Button>
                             {country === 'india' && (
                                <div>
                                    <Label htmlFor="transactionType" className="text-base">লেনদেনের ধরন (ভারতের জন্য)</Label>
                                    <Select onValueChange={(value) => setTransactionType(value as 'intra' | 'inter')} value={transactionType}>
                                        <SelectTrigger className="mt-2 text-base h-12">
                                            <SelectValue placeholder="ধরন নির্বাচন করুন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="intra">রাজ্যের মধ্যে (Intra-State)</SelectItem>
                                            <SelectItem value="inter">রাজ্যের বাইরে (Inter-State)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                             )}
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card ref={resultCardRef} className="bg-muted/50">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl font-headline">হিসাবের ফলাফল</CardTitle>
                                        <CardDescription>আপনার দেওয়া তথ্যের ভিত্তিতে ফলাফল।</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={handleShare}>
                                        <Share2 className="w-5 h-5"/>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-lg">
                                <div className="flex justify-between items-center">
                                    <span>করযোগ্য মূল্য:</span>
                                    <span className="font-semibold">{formatCurrency(totalCalculation.totalTaxableValue)}</span>
                                </div>
                                
                                {country === 'india' ? (
                                    transactionType === 'intra' ? (
                                        <>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                                                <span>CGST:</span>
                                                <span className="font-semibold">{formatCurrency(totalCalculation.cgst)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                                                <span>SGST:</span>
                                                <span className="font-semibold">{formatCurrency(totalCalculation.sgst)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                                            <span>IGST:</span>
                                            <span className="font-semibold">{formatCurrency(totalCalculation.igst)}</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span>মোট কর:</span>
                                        <span className="font-semibold">{formatCurrency(totalCalculation.totalTaxAmount)}</span>
                                    </div>
                                )}

                                <Separator />
                                <div className="flex justify-between items-center text-2xl font-bold text-primary">
                                    <span>মোট মূল্য:</span>
                                    <span>{formatCurrency(totalCalculation.finalPrice)}</span>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {history.length > 0 && (
                            <Accordion type="single" collapsible>
                                <AccordionItem value="history">
                                    <AccordionTrigger className="text-lg font-headline flex items-center gap-2">
                                        <History className="w-5 h-5"/>
                                        হিসাবের ইতিহাস (History)
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            {history.map(hist => (
                                                <Card key={hist.id} className="p-3 relative group">
                                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => loadFromHistory(hist)}>
                                                        <div>
                                                            <p className="font-semibold">{formatCurrency(hist.totalPrice)}</p>
                                                            <p className="text-xs text-muted-foreground">{hist.timestamp}</p>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {hist.items.length} আইটেম ({hist.country === 'india' ? 'ভারত' : 'বাংলাদেশ'})
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => { e.stopPropagation(); deleteHistoryItem(hist.id); }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </Card>
                                            ))}
                                            <Button variant="outline" size="sm" className="w-full mt-2" onClick={clearHistory}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                হিস্টোরি মুছুন
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
