
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy, PlusCircle, Trash2, IndianRupee, Percent, Hash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    transactionType: 'intra' | 'inter';
    timestamp: string;
}

const getInitialItems = (): CalculationItem[] => [{ id: 1, amount: 1000, rate: '18' }];

export default function GstVatCalculator() {
    const [items, setItems] = useState<CalculationItem[]>(getInitialItems);
    const [mode, setMode] = useState<'add' | 'remove'>('add');
    const [transactionType, setTransactionType] = useState<'intra' | 'inter'>('intra');
    const { toast } = useToast();
    const [history, setHistory] = useState<HistoryItem[]>([]);

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

    const saveToHistory = useCallback(() => {
        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString(),
            items,
            mode,
            transactionType,
            timestamp: new Date().toLocaleString('bn-BD'),
        };
        
        const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
        setHistory(updatedHistory);
        try {
            localStorage.setItem('gstHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    }, [items, mode, transactionType, history]);

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
        setItems([...items, { id: Date.now(), amount: 0, rate: '18' }]);
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
            cgst: transactionType === 'intra' ? totalTaxAmount / 2 : 0,
            sgst: transactionType === 'intra' ? totalTaxAmount / 2 : 0,
            igst: transactionType === 'inter' ? totalTaxAmount : 0,
        };
    }, [items, mode, transactionType]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if (totalCalculation.finalPrice > 0) {
              saveToHistory();
            }
        }, 1500); // Debounce saving to history
        return () => clearTimeout(handler);
    }, [items, mode, transactionType]); // Deliberately not including saveToHistory

    const formatCurrency = (value: number) => `${value.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} টাকা`;
    
    const copyResultToClipboard = () => {
        const { totalTaxableValue, totalTaxAmount, finalPrice, cgst, sgst, igst } = totalCalculation;
        let resultText = `
হিসাবের ফলাফল:
---------------------
আসল মূল্য: ${formatCurrency(totalTaxableValue)}
মোট কর: ${formatCurrency(totalTaxAmount)}
`;
        if (transactionType === 'intra') {
            resultText += `CGST: ${formatCurrency(cgst)}\nSGST: ${formatCurrency(sgst)}\n`;
        } else {
            resultText += `IGST: ${formatCurrency(igst)}\n`;
        }
        resultText += `---------------------\nমোট মূল্য: ${formatCurrency(finalPrice)}`;

        navigator.clipboard.writeText(resultText.trim());
        toast({
            title: "কপি হয়েছে!",
            description: "হিসাবের ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।",
        });
    };
    
    const loadFromHistory = (historyItem: HistoryItem) => {
        setItems(historyItem.items);
        setMode(historyItem.mode);
        setTransactionType(historyItem.transactionType);
        toast({ title: "ইতিহাস লোড হয়েছে" });
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
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
                                                        <SelectGroup>
                                                            <SelectLabel>ক্যাটাগরি অনুযায়ী</SelectLabel>
                                                            {Object.entries(GST_CATEGORIES).map(([key, value]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {value.name} ({value.rate}%)
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
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
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl font-headline">হিসাবের ফলাফল</CardTitle>
                                        <CardDescription>আপনার দেওয়া তথ্যের ভিত্তিতে ফলাফল।</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={copyResultToClipboard}>
                                        <Copy className="w-5 h-5"/>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-lg">
                                <div className="flex justify-between items-center">
                                    <span>করযোগ্য মূল্য:</span>
                                    <span className="font-semibold">{formatCurrency(totalCalculation.totalTaxableValue)}</span>
                                </div>
                                {transactionType === 'intra' ? (
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
                                    <AccordionTrigger className="text-lg font-headline">হিসাবের ইতিহাস (History)</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            {history.map(hist => (
                                                <Card key={hist.id} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => loadFromHistory(hist)}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold">{formatCurrency(hist.items.reduce((acc, curr) => acc + (parseFloat(String(curr.amount)) || 0), 0))}</p>
                                                            <p className="text-xs text-muted-foreground">{hist.timestamp}</p>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {hist.items.length} আইটেম
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
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
