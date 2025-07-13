
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Printer, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-to-docx';


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

const allTemplates = {
    bn: {
        job: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: অনাপত্তিপত্র (No Objection Certificate) প্রসঙ্গে।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাইতেছে যে, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, আমাদের প্রতিষ্ঠানে একজন ${data.designation || `[${t.designation}]`} হিসেবে কর্মরত আছেন।\n\nতার ${data.purpose || `[${t.purpose}]`} এর জন্য আমাদের পক্ষ থেকে কোনো আপত্তি নেই। আমরা তার সার্বিক সাফল্য কামনা করি।\n\nবিনীত,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`
    },
    en: {
        job: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate (NOC).\n\nDear Sir/Madam,\nThis is to certify that ${data.name || `[${t.name}]`}, Son/Daughter of ${data.fathersName || `[${t.fathersName}]`}, is a valued employee at our organization, serving as a ${data.designation || `[${t.designation}]`}.\n\nWe have no objection to him/her for the purpose of ${data.purpose || `[${t.purpose}]`}. We wish him/her all the best for their future endeavors.\n\nSincerely,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`
    }
};

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
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lang: 'bn',
            letterType: 'job',
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
            const templateFunction = allTemplates[lang][letterType] || ((d, tr) => `Template for ${letterType} is not available in ${lang}.`);
            const letter = templateFunction(data, t);
            setGeneratedLetter(letter);
        }
    }, [watchedValues, lang, t]);

    useEffect(() => {
        setIssueDate(format(new Date(), 'PP', { locale: lang === 'bn' ? bn : enUS }));
    }, [lang]);

    const handleReset = () => {
        reset({
            lang: lang,
            letterType: 'job',
            name: '',
            fathersName: '',
            purpose: '',
            authorityName: '',
            designation: '',
            organizationName: '',
        });
        setGeneratedLetter('');
    };

    const handleCopy = () => {
        if (letterPreviewRef.current) {
            const letterText = letterPreviewRef.current.innerText;
            navigator.clipboard.writeText(letterText);
            toast({
                title: t.copiedSuccess,
            });
        }
    };
    
    const handleDownloadDoc = async () => {
       if (letterPreviewRef.current) {
           const htmlString = `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 12pt;
                    white-space: pre-wrap;
                }
            </style>
            </head>
            <body>
                ${letterPreviewRef.current.innerHTML.replace(/\n/g, '<br />')}
            </body>
            </html>`;
           
           try {
                const blob = await asBlob(htmlString);
                saveAs(blob, 'NOC-Letter.docx');
           } catch(error) {
               console.error("Error generating DOCX:", error);
               toast({ title: "ডাউনলোড ব্যর্থ হয়েছে", description: "DOCX ফাইল তৈরি করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
           }
       }
    };
    
    const handleDownloadPdf = () => {
        const input = letterPreviewRef.current;
        if (input) {
            html2canvas(input, {
                scale: 2, // Higher scale for better quality
                useCORS: true, 
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4'
                });
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const width = pdfWidth - 20; // with some margin
                const height = width / ratio;

                let finalHeight = height;
                if(height > pdfHeight - 20) {
                  finalHeight = pdfHeight - 20;
                }
                
                pdf.addImage(imgData, 'PNG', 10, 10, width, finalHeight);
                pdf.save("NOC-Letter.pdf");
            }).catch(error => {
                console.error("Error generating PDF:", error);
                toast({ title: "ডাউনলোড ব্যর্থ হয়েছে", description: "PDF ফাইল তৈরি করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
            });
        }
    };
    
    const handlePrint = () => {
        const previewElement = letterPreviewRef.current;
        if (previewElement) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print NOC</title>');
                printWindow.document.write('<style> body { font-family: sans-serif; white-space: pre-wrap; padding: 20px; } </style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(previewElement.innerHTML.replace(/\n/g, '<br>'));
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            } else {
                 toast({ title: t.printError, variant: "destructive" });
            }
        }
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
                                            value={field.value}
                                            onValueChange={(value) => {
                                                const newLang = value as 'bn' | 'en';
                                                field.onChange(newLang);
                                                setLang(newLang);
                                                setValue('lang', newLang);
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
                        <div ref={letterPreviewRef} className="p-6 border rounded-md min-h-[400px] bg-background">
                            <p className="mb-4 whitespace-pre-wrap">{t.issueDate}: {issueDate}</p>
                            <div className="whitespace-pre-wrap text-sm">{generatedLetter}</div>
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

    