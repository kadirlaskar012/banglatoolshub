
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Printer, RotateCcw, Upload, Heading } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';

// Translations and Templates
const translations = {
    bn: {
        title: "NOC Letter Generator (বাংলা)",
        description: "আপনার প্রয়োজন অনুযায়ী তথ্য দিয়ে সহজেই পেশাদার অনাপত্তিপত্র (NOC) তৈরি করুন।",
        language: "ভাষা",
        letterType: "চিঠির ধরন",
        selectLetterType: "চিঠির ধরন নির্বাচন করুন",
        name: "পূর্ণ নাম",
        fathersName: "পিতার নাম",
        designation: "পদবি",
        organizationName: "প্রতিষ্ঠানের নাম",
        address: "বর্তমান ঠিকানা",
        mobile: "মোবাইল নম্বর (ঐচ্ছিক)",
        purpose: "NOC-এর উদ্দেশ্য",
        authorityName: "কর্তৃপক্ষের নাম",
        issueDate: "ইস্যু করার তারিখ",
        preview: "চিঠির প্রিভিউ",
        outputOptions: "আউটপুট অপশন",
        downloadPDF: "PDF ডাউনলোড করুন",
        downloadDOC: "DOC ডাউনলোড করুন",
        copy: "কপি করুন",
        print: "প্রিন্ট করুন",
        reset: "রিসেট করুন",
        signature: "স্বাক্ষর",
        copiedSuccess: "চিঠিটি ক্লিপবোর্ডে কপি করা হয়েছে!",
        printError: "প্রিন্ট করার সময় একটি সমস্যা হয়েছে।",
        letterTypes: {
            job: "চাকরির জন্য",
            travel: "ভ্রমণ/ভিসার জন্য",
            vehicle: "গাড়ির জন্য",
            property: "জমি/সম্পত্তির জন্য",
            rent: "ভাড়া চুক্তির জন্য",
            nameChange: "নাম পরিবর্তনের জন্য",
            student: "শিক্ষার্থীদের জন্য",
            business: "ব্যবসার অনুমতির জন্য",
            bank: "ব্যাংক/লোনের জন্য",
        }
    },
    en: {
        title: "NOC Letter Generator (English)",
        description: "Easily create a professional No Objection Certificate (NOC) by providing necessary information.",
        language: "Language",
        letterType: "Letter Type",
        selectLetterType: "Select Letter Type",
        name: "Full Name",
        fathersName: "Father's Name",
        designation: "Designation",
        organizationName: "Organization Name",
        address: "Current Address",
        mobile: "Mobile Number (Optional)",
        purpose: "Purpose of NOC",
        authorityName: "Authority's Name",
        issueDate: "Issue Date",
        preview: "Letter Preview",
        outputOptions: "Output Options",
        downloadPDF: "Download as PDF",
        downloadDOC: "Download as DOC",
        copy: "Copy",
        print: "Print",
        reset: "Reset",
        signature: "Signature",
        copiedSuccess: "Letter copied to clipboard!",
        printError: "An error occurred while trying to print.",
        letterTypes: {
            job: "For Job",
            travel: "For Travel/Visa",
            vehicle: "For Vehicle",
            property: "For Property/Land",
            rent: "For Rent Agreement",
            nameChange: "For Name Change",
            student: "For Student",
            business: "For Business Permit",
            bank: "For Bank/Loan",
        }
    }
};

const nocTemplates = {
    bn: {
        job: (data: any) => `বরাবর,\n${data.authorityName || '[কর্তৃপক্ষের নাম]'}\n\nবিষয়: অনাপত্তিপত্র (No Objection Certificate) প্রসঙ্গে।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাইতেছে যে, ${data.name || '[নাম]'}, পিতা: ${data.fathersName || '[পিতার নাম]'}, আমাদের প্রতিষ্ঠানে একজন ${data.designation || '[পদবি]'} হিসেবে কর্মরত আছেন।\n\nতার ${data.purpose || '[উদ্দেশ্য]'} এর জন্য আমাদের পক্ষ থেকে কোনো আপত্তি নেই। আমরা তার সার্বিক সাফল্য কামনা করি।\n\nবিনীত,\n\n\n(স্বাক্ষর)\n${data.organizationName || '[প্রতিষ্ঠানের নাম]'}`
    },
    en: {
        job: (data: any) => `To,\nThe ${data.authorityName || '[Authority Name]'}\n\nSubject: No Objection Certificate (NOC).\n\nDear Sir/Madam,\nThis is to certify that ${data.name || '[Name]'}, Son/Daughter of ${data.fathersName || "[Father's Name]"}, is a valued employee at our organization, serving as a ${data.designation || '[Designation]'}.\n\nWe have no objection to him/her for the purpose of ${data.purpose || '[purpose]'}. We wish him/her all the best for their future endeavors.\n\nSincerely,\n\n\n(Signature)\n${data.organizationName || '[Organization Name]'}`
    }
};

// --- Add other templates similarly ---
const allTemplates = {
    bn: {
        ...nocTemplates.bn,
        travel: (data: any) => `... (ভ্রমণের জন্য টেমপ্লেট) ...`,
        vehicle: (data: any) => `... (গাড়ির জন্য টেমপ্লেট) ...`,
    },
    en: {
        ...nocTemplates.en,
        travel: (data: any) => `... (Template for travel) ...`,
        vehicle: (data: any) => `... (Template for vehicle) ...`,
    }
}


const FormSchema = z.object({
    lang: z.enum(['bn', 'en']),
    letterType: z.string().min(1, "চিঠির ধরন নির্বাচন করুন"),
    name: z.string().min(3, "নাম প্রয়োজন"),
    fathersName: z.string().min(3, "পিতার নাম প্রয়োজন"),
    designation: z.string().optional(),
    organizationName: z.string().optional(),
    address: z.string().optional(),
    mobile: z.string().optional(),
    purpose: z.string().min(5, "উদ্দেশ্য প্রয়োজন"),
    authorityName: z.string().min(3, "কর্তৃপক্ষের নাম প্রয়োজন"),
});

type FormData = z.infer<typeof FormSchema>;

export default function NocLetterGenerator() {
    const [lang, setLang] = useState<'bn' | 'en'>('bn');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const letterPreviewRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const t = translations[lang];

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lang: 'bn',
            letterType: '',
            name: '',
            fathersName: '',
            purpose: '',
            authorityName: '',
            designation: '',
            organizationName: '',
        },
    });

    const watchedValues = watch();

    useEffect(() => {
        const { letterType, ...data } = watchedValues;
        if (letterType) {
            // @ts-ignore
            const templateFunction = allTemplates[lang][letterType] || ((d) => `Template for ${letterType} is not available.`);
            const letter = templateFunction(data);
            setGeneratedLetter(letter);
        }
    }, [watchedValues, lang]);
    
    useEffect(() => {
        setIssueDate(format(new Date(), 'PP', { locale: lang === 'bn' ? bn : enUS }));
    }, [lang]);

     const handleReset = () => {
        reset();
        setGeneratedLetter('');
    };

    const handleCopy = () => {
        if (letterPreviewRef.current) {
            navigator.clipboard.writeText(letterPreviewRef.current.innerText);
            toast({
                title: t.copiedSuccess,
            });
        }
    };
    
    // Placeholder for DOC download
    const handleDownloadDoc = async () => {
       alert("DOC download feature is coming soon!");
    };
    
    // Placeholder for PDF download
    const handleDownloadPdf = async () => {
        alert("PDF download feature is coming soon!");
    };
    
    // Placeholder for Print
    const handlePrint = () => {
        alert("Print feature is coming soon!");
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form>
                        <div className="space-y-4">
                             <div>
                                <Label>{t.language}</Label>
                                <Controller
                                    name="lang"
                                    control={control}
                                    render={({ field }) => (
                                        <Tabs
                                            defaultValue={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setLang(value as 'bn' | 'en');
                                            }}
                                            className="w-full mt-1"
                                        >
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="bn">বাংলা</TabsTrigger>
                                                <TabsTrigger value="en">English</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    )}
                                />
                            </div>

                            <div>
                                <Label htmlFor="letterType">{t.letterType}</Label>
                                <Controller
                                    name="letterType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="letterType">
                                                <SelectValue placeholder={t.selectLetterType} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(t.letterTypes).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                 {errors.letterType && <p className="text-red-500 text-xs mt-1">{errors.letterType.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">{t.name}</Label>
                                    <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="fathersName">{t.fathersName}</Label>
                                    <Controller name="fathersName" control={control} render={({ field }) => <Input id="fathersName" {...field} />} />
                                     {errors.fathersName && <p className="text-red-500 text-xs mt-1">{errors.fathersName.message}</p>}
                                </div>
                            </div>
                            
                             <div>
                                <Label htmlFor="authorityName">{t.authorityName}</Label>
                                <Controller name="authorityName" control={control} render={({ field }) => <Input id="authorityName" {...field} />} />
                                {errors.authorityName && <p className="text-red-500 text-xs mt-1">{errors.authorityName.message}</p>}
                            </div>
                            
                            {['job'].includes(watchedValues.letterType) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="designation">{t.designation}</Label>
                                    <Controller name="designation" control={control} render={({ field }) => <Input id="designation" {...field} />} />
                                </div>
                                <div>
                                    <Label htmlFor="organizationName">{t.organizationName}</Label>
                                    <Controller name="organizationName" control={control} render={({ field }) => <Input id="organizationName" {...field} />} />
                                </div>
                               </div>
                            )}

                             <div>
                                <Label htmlFor="purpose">{t.purpose}</Label>
                                <Controller name="purpose" control={control} render={({ field }) => <Input id="purpose" {...field} />} />
                                {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>}
                            </div>
                            
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.preview}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div ref={letterPreviewRef} className="p-6 border rounded-md min-h-[400px] whitespace-pre-wrap bg-background text-sm">
                            <p className="mb-4">{t.issueDate}: {issueDate}</p>
                            {generatedLetter}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t.outputOptions}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" />{t.downloadPDF}</Button>
                        <Button onClick={handleDownloadDoc}><Download className="mr-2 h-4 w-4" />{t.downloadDOC}</Button>
                        <Button onClick={handleCopy} variant="outline"><Copy className="mr-2 h-4 w-4" />{t.copy}</Button>
                        <Button onClick={handlePrint} variant="outline"><Printer className="mr-2 h-4 w-4" />{t.print}</Button>
                        <Button onClick={handleReset} variant="destructive" className="lg:col-span-2"><RotateCcw className="mr-2 h-4 w-4" />{t.reset}</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
