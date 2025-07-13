
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
        passportNumber: "পাসপোর্ট নম্বর",
        vehicleInfo: "গাড়ির তথ্য (e.g., Toyota-Corolla-2022)",
        vehicleRegNumber: "রেজিস্ট্রেশন নম্বর",
        chassisNumber: "চ্যাসিস নম্বর",
        engineNumber: "ইঞ্জিন নম্বর",
        propertyAddress: "সম্পত্তির ঠিকানা",
        studentInfo: "ছাত্র/ছাত্রীর আইডি নম্বর",
        courseName: "কোর্সের নাম",
        bankName: "ব্যাংকের নাম",
        accountNumber: "অ্যাকাউন্ট নম্বর",
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
        passportNumber: "Passport Number",
        vehicleInfo: "Vehicle Info (e.g., Toyota-Corolla-2022)",
        vehicleRegNumber: "Registration Number",
        chassisNumber: "Chassis Number",
        engineNumber: "Engine Number",
        propertyAddress: "Property Address",
        studentInfo: "Student ID Number",
        courseName: "Course Name",
        bankName: "Bank Name",
        accountNumber: "Account Number",
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
        job: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: অনাপত্তিপত্র (No Objection Certificate) প্রসঙ্গে।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাইতেছে যে, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, আমাদের প্রতিষ্ঠানে একজন ${data.designation || `[${t.designation}]`} হিসেবে কর্মরত আছেন।\n\nতার ${data.purpose || `[${t.purpose}]`} এর জন্য আমাদের পক্ষ থেকে কোনো আপত্তি নেই। আমরা তার সার্বিক সাফল্য কামনা করি।\n\nবিনীত,\n\n\n\n(${data.name || `[${t.name}]`})\n${data.organizationName || `[${t.organizationName}]`}`,
        travel: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: বিদেশ ভ্রমণের জন্য অনাপত্তিপত্র।\n\nজনাব,\nআমি, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, ${data.organizationName || `[${t.organizationName}]`} এর একজন ${data.designation || `[${t.designation}]`}। আমার পাসপোর্ট নম্বর ${data.passportNumber || '[পাসপোর্ট নম্বর]'}।\n\nআমি ${data.purpose || `[উদ্দেশ্য, যেমন - পর্যটন/ব্যবসা]`}-এর জন্য বিদেশ ভ্রমণে যেতে ইচ্ছুক। এই ভ্রমণের বিষয়ে আমার নিয়োগকর্তা বা প্রতিষ্ঠানের পক্ষ থেকে কোনো আপত্তি নেই।\n\nঅতএব, মহোদয়ের নিকট আমার আবেদন, আমাকে উক্ত ভ্রমণের জন্য একটি অনাপত্তিপত্র (NOC) প্রদান করে বাধিত করবেন।\n\nবিনীত,\n\n\n\n(${data.name || `[${t.name}]`})\n${data.organizationName || `[${t.organizationName}]`}`,
        vehicle: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: গাড়ির মালিকানা হস্তান্তর/স্থানান্তরের জন্য অনাপত্তিপত্র।\n\nজনাব,\nএই মর্মে জানানো যাচ্ছে যে, আমি, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, নিম্নোক্ত গাড়ির বর্তমান মালিক:\n\nগাড়ির বিবরণ: ${data.vehicleInfo || `[${t.vehicleInfo}]`}\nরেজিস্ট্রেশন নম্বর: ${data.vehicleRegNumber || `[${t.vehicleRegNumber}]`}\nচ্যাসিস নম্বর: ${data.chassisNumber || `[${t.chassisNumber}]`}\nইঞ্জিন নম্বর: ${data.engineNumber || `[${t.engineNumber}]`}\n\nআমি উক্ত গাড়িটি ${data.purpose || `[উদ্দেশ্য, যেমন- বিক্রয়/স্থানান্তর]`} করতে চাই। এই বিষয়ে আমার কোনো আপত্তি নেই।\n\nঅতএব, প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুরোধ করা হলো।\n\nবিনীত,\n\n\n\n(${data.name || `[${t.name}]`})`,
        property: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: জমি/সম্পত্তির জন্য অনাপত্তিপত্র।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${data.propertyAddress || `[${t.propertyAddress}]`} ঠিকানায় অবস্থিত সম্পত্তির মালিক ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}।\n\nউক্ত সম্পত্তির উপর ${data.purpose || `[উদ্দেশ্য, যেমন- নির্মাণ/বিক্রয়]`} করার ক্ষেত্রে আমাদের/আমার কোনো আপত্তি নেই।\n\nআপনার সদয় বিবেচনার জন্য ধন্যবাদ।\n\nবিনীত,\n\n\n\n(${data.organizationName || `[${t.organizationName}]`})`,
        rent: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: ফ্ল্যাট/বাড়ি ভাড়ার জন্য অনাপত্তিপত্র।\n\nজনাব,\nআমি, ${data.name || `[${t.name}]`}, ${data.propertyAddress || `[${t.propertyAddress}]`} ঠিকানায় অবস্থিত ফ্ল্যাটের মালিক।\n\nআমি আমার ফ্ল্যাটটি ${data.purpose || `[ভাড়াটিয়ার নাম]`}-কে ভাড়া দিতে ইচ্ছুক। এই বিষয়ে আমার কোনো আপত্তি নেই এবং এর জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণে আমি সম্মতি প্রদান করছি।\n\nধন্যবাদান্তে,\n\n\n\n(${data.name || `[${t.name}]`})`,
        nameChange: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: নাম পরিবর্তনের জন্য অনাপত্তিপত্র।\n\nজনাব,\nএই মর্মে জানানো যাচ্ছে যে, আমি, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, আমার নাম পরিবর্তন করে ${data.purpose || `[নতুন নাম]`} রাখতে ইচ্ছুক।\n\nআমার এই নাম পরিবর্তনে পরিবারের বা অন্য কোনো পক্ষের কোনো আপত্তি নেই।\n\nঅতএব, বিষয়টি বিবেচনাপূর্বক প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুরোধ করছি।\n\nবিনীত,\n\n\n\n(${data.name || `[${t.name}]`})`,
        student: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: শিক্ষার্থীর জন্য অনাপত্তিপত্র।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${data.name || `[${t.name}]`}, আইডি: ${data.studentInfo || `[${t.studentInfo}]`}, আমাদের প্রতিষ্ঠানে ${data.courseName || `[${t.courseName}]`} প্রোগ্রামের একজন নিয়মিত ছাত্র/ছাত্রী।\n\nতার ${data.purpose || `[উদ্দেশ্য, যেমন- ইন্টার্নশিপ/প্রতিযোগিতা]`}-এর জন্য আমাদের প্রতিষ্ঠানের পক্ষ থেকে কোনো আপত্তি নেই। আমরা তার সার্বিক মঙ্গল কামনা করি।\n\nধন্যবাদান্তে,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`,
        business: (data: any, t: any) => `বরাবর,\n${data.authorityName || `[${t.authorityName}]`}\n\nবিষয়: ব্যবসার অনুমতির জন্য অনাপত্তিপত্র।\n\nজনাব,\nআমি, ${data.name || `[${t.name}]`}, পিতা: ${data.fathersName || `[${t.fathersName}]`}, ${data.address || `[${t.address}]`} ঠিকানায় একটি ${data.purpose || `[ব্যবসার ধরন]`} ব্যবসা শুরু করতে ইচ্ছুক।\n\nএই বিষয়ে সংশ্লিষ্ট এলাকার বাড়ির মালিক/সমিতি/কর্তৃপক্ষের কোনো আপত্তি নেই।\n\nঅতএব, আমাকে ব্যবসার লাইসেন্স বা প্রয়োজনীয় অনুমতি প্রদানের জন্য অনুরোধ করা হলো।\n\nবিনীত,\n\n\n\n(${data.name || `[${t.name}]`})`,
        bank: (data: any, t: any) => `বরাবর,\nব্যবস্থাপক,\n${data.bankName || `[${t.bankName}]`}\n${data.address || `[${t.address}]`}\n\nবিষয়: অনাপত্তিপত্র প্রসঙ্গে।\n\nজনাব,\nএই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${data.name || `[${t.name}]`}, আমাদের প্রতিষ্ঠানে ${data.designation || `[${t.designation}]`} পদে কর্মরত আছেন। তার অ্যাকাউন্ট নম্বর হলো ${data.accountNumber || `[${t.accountNumber}]`}।\n\nতিনি আপনার ব্যাংক থেকে ${data.purpose || `[উদ্দেশ্য, যেমন- ব্যক্তিগত লোন/ক্রেডিট কার্ড]`} নিতে ইচ্ছুক। এই বিষয়ে আমাদের প্রতিষ্ঠানের পক্ষ থেকে কোনো আপত্তি নেই।\n\nধন্যবাদান্তে,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`
    },
    en: {
        job: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate (NOC).\n\nDear Sir/Madam,\nThis is to certify that ${data.name || `[${t.name}]`}, Son/Daughter of ${data.fathersName || `[${t.fathersName}]`}, is a valued employee at our organization, serving as a ${data.designation || `[${t.designation}]`}.\n\nWe have no objection to him/her for the purpose of ${data.purpose || `[${t.purpose}]`}. We wish him/her all the best for their future endeavors.\n\nSincerely,\n\n\n\n(${data.name || `[${t.name}]`})\n${data.organizationName || `[${t.organizationName}]`}`,
        travel: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate for Foreign Travel.\n\nDear Sir/Madam,\nThis is to certify that ${data.name || `[${t.name}]`}, Son/Daughter of ${data.fathersName || `[${t.fathersName}]`}, is currently employed as a ${data.designation || `[${t.designation}]`} at ${data.organizationName || `[${t.organizationName}]`}. His/Her passport number is ${data.passportNumber || '[Passport Number]'}.\n\nWe have no objection to him/her travelling abroad for the purpose of ${data.purpose || `[purpose, e.g., tourism/business]`}.\n\nThis certificate is issued upon his/her request.\n\nSincerely,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`,
        vehicle: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate for Vehicle Transfer.\n\nDear Sir/Madam,\nThis is to certify that I, ${data.name || `[${t.name}]`}, Son/Daughter of ${data.fathersName || `[${t.fathersName}]`}, am the legal owner of the following vehicle:\n\nVehicle Model: ${data.vehicleInfo || `[${t.vehicleInfo}]`}\nRegistration No: ${data.vehicleRegNumber || `[${t.vehicleRegNumber}]`}\nChassis No: ${data.chassisNumber || `[${t.chassisNumber}]`}\nEngine No: ${data.engineNumber || `[${t.engineNumber}]`}\n\nI have no objection regarding the ${data.purpose || `[purpose, e.g., sale/transfer]`} of the said vehicle.\n\nThis certificate is issued to facilitate the necessary legal procedures.\n\nSincerely,\n\n\n\n(${data.name || `[${t.name}]`})`,
        property: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate for Property.\n\nDear Sir/Madam,\nThis is to certify that we/I have no objection to ${data.name || `[${t.name}]`}, owner of the property located at ${data.propertyAddress || `[${t.propertyAddress}]`}, for the purpose of ${data.purpose || `[purpose, e.g., construction/mortgage]`}.\n\nThis certificate is issued upon request for official use.\n\nSincerely,\n\n\n\n(${data.organizationName || `[${t.organizationName}]`})`,
        rent: (data: any, t: any) => `To Whom It May Concern,\n\nSubject: No Objection Certificate for Renting Property.\n\nI, ${data.name || `[${t.name}]`}, owner of the property located at ${data.propertyAddress || `[${t.propertyAddress}]`}, hereby state that I have no objection to renting out my property to ${data.purpose || `[Tenant's Name]`}.\n\nThis certificate is issued for the purpose of completing the rental agreement formalities.\n\nSincerely,\n\n\n\n(${data.name || `[${t.name}]`})`,
        nameChange: (data: any, t: any) => `To Whom It May Concern,\n\nSubject: No Objection Certificate for Name Change.\n\nThis is to certify that I, ${data.name || `[${t.name}]`}, have no objection to the name change of myself/my ward to ${data.purpose || `[New Name]`}.\n\nThis NOC is issued to support the legal process of updating the name in all official records.\n\nSincerely,\n\n\n\n(${data.name || `[${t.name}]`})`,
        student: (data: any, t: any) => `To Whom It May Concern,\n\nSubject: No Objection Certificate for Student.\n\nThis is to certify that ${data.name || `[${t.name}]`}, Student ID: ${data.studentInfo || `[${t.studentInfo}]`}, is a bonafide student of our institution, pursuing the ${data.courseName || `[${t.courseName}]`} program.\n\nWe have no objection to him/her participating in/applying for ${data.purpose || `[purpose, e.g., internship/competition]`}.\n\nWe wish him/her all the best.\n\nSincerely,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`,
        business: (data: any, t: any) => `To,\nThe ${data.authorityName || `[${t.authorityName}]`}\n\nSubject: No Objection Certificate for Business Permit.\n\nThis is to certify that I, ${data.name || `[${t.name}]`}, owner of the premises at ${data.address || `[${t.address}]`}, have no objection to a ${data.purpose || `[Type of Business]`} business being operated at the said location.\n\nThis certificate is provided to obtain the necessary trade license and permits.\n\nSincerely,\n\n\n\n(${data.name || `[${t.name}]`})`,
        bank: (data: any, t: any) => `To,\nThe Branch Manager,\n${data.bankName || `[${t.bankName}]`}\n${data.address || `[${t.address}]`}\n\nSubject: No Objection Certificate.\n\nDear Sir/Madam,\nThis is to certify that ${data.name || `[${t.name}]`} is a permanent employee of our organization, working as a ${data.designation || `[${t.designation}]`}. His/Her bank account number is ${data.accountNumber || `[${t.accountNumber}]`}.\n\nWe have no objection to him/her applying for a ${data.purpose || `[purpose, e.g., Personal Loan/Credit Card]`} from your bank. Our organization is not liable for any financial transactions made by him/her.\n\nSincerely,\n\n\n\n(${t.signature})\n${data.organizationName || `[${t.organizationName}]`}`
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
    passportNumber: z.string().optional(),
    vehicleInfo: z.string().optional(),
    vehicleRegNumber: z.string().optional(),
    chassisNumber: z.string().optional(),
    engineNumber: z.string().optional(),
    propertyAddress: z.string().optional(),
    studentInfo: z.string().optional(),
    courseName: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
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
           const letterText = letterPreviewRef.current.innerText;
           const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
           saveAs(blob, 'NOC-Letter.doc');
       }
    };
    
    const handleDownloadPdf = () => {
        const input = letterPreviewRef.current;
        if (input) {
            html2canvas(input, {
                scale: 2,
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
                const width = pdfWidth - 20;
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
                // Use innerText to get the rendered text with line breaks
                const letterContent = previewElement.innerText.replace(/\n/g, '<br>');
                printWindow.document.write(letterContent);
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
                                    <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} placeholder={t.name}/>} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="fathersName">{t.fathersName}</Label>
                                    <Controller name="fathersName" control={control} render={({ field }) => <Input id="fathersName" {...field} placeholder={t.fathersName}/>} />
                                    {errors.fathersName && <p className="text-red-500 text-xs mt-1">{errors.fathersName.message}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="authorityName">{t.authorityName}</Label>
                                <Controller name="authorityName" control={control} render={({ field }) => <Input id="authorityName" {...field} placeholder={t.authorityName} />} />
                                {errors.authorityName && <p className="text-red-500 text-xs mt-1">{errors.authorityName.message}</p>}
                            </div>

                             {['job', 'travel', 'student', 'bank'].includes(watchedValues.letterType) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="designation">{t.designation}</Label>
                                        <Controller name="designation" control={control} render={({ field }) => <Input id="designation" {...field} placeholder={t.designation}/>} />
                                    </div>
                                    <div>
                                        <Label htmlFor="organizationName">{t.organizationName}</Label>
                                        <Controller name="organizationName" control={control} render={({ field }) => <Input id="organizationName" {...field} placeholder={t.organizationName}/>} />
                                    </div>
                                </div>
                            )}

                             {['business', 'rent', 'bank'].includes(watchedValues.letterType) && (
                                <div>
                                    <Label htmlFor="address">{t.address}</Label>
                                    <Controller name="address" control={control} render={({ field }) => <Input id="address" {...field} placeholder={t.address}/>} />
                                </div>
                            )}
                            
                            {['travel'].includes(watchedValues.letterType) && (
                                <div>
                                    <Label htmlFor="passportNumber">{t.passportNumber}</Label>
                                    <Controller name="passportNumber" control={control} render={({ field }) => <Input id="passportNumber" {...field} placeholder={t.passportNumber}/>} />
                                </div>
                            )}

                            {['vehicle'].includes(watchedValues.letterType) && (
                                <div className="space-y-4">
                                     <div>
                                        <Label htmlFor="vehicleInfo">{t.vehicleInfo}</Label>
                                        <Controller name="vehicleInfo" control={control} render={({ field }) => <Input id="vehicleInfo" {...field} placeholder={t.vehicleInfo}/>} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div><Label htmlFor="vehicleRegNumber">{t.vehicleRegNumber}</Label><Controller name="vehicleRegNumber" control={control} render={({ field }) => <Input id="vehicleRegNumber" {...field} />} /></div>
                                        <div><Label htmlFor="chassisNumber">{t.chassisNumber}</Label><Controller name="chassisNumber" control={control} render={({ field }) => <Input id="chassisNumber" {...field} />} /></div>
                                        <div><Label htmlFor="engineNumber">{t.engineNumber}</Label><Controller name="engineNumber" control={control} render={({ field }) => <Input id="engineNumber" {...field} />} /></div>
                                    </div>
                                </div>
                            )}

                            {['property', 'rent'].includes(watchedValues.letterType) && (
                                <div>
                                    <Label htmlFor="propertyAddress">{t.propertyAddress}</Label>
                                    <Controller name="propertyAddress" control={control} render={({ field }) => <Input id="propertyAddress" {...field} placeholder={t.propertyAddress}/>} />
                                </div>
                            )}
                             
                            {['student'].includes(watchedValues.letterType) && (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><Label htmlFor="studentInfo">{t.studentInfo}</Label><Controller name="studentInfo" control={control} render={({ field }) => <Input id="studentInfo" {...field} />} /></div>
                                    <div><Label htmlFor="courseName">{t.courseName}</Label><Controller name="courseName" control={control} render={({ field }) => <Input id="courseName" {...field} />} /></div>
                                </div>
                            )}

                             {['bank'].includes(watchedValues.letterType) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><Label htmlFor="bankName">{t.bankName}</Label><Controller name="bankName" control={control} render={({ field }) => <Input id="bankName" {...field} />} /></div>
                                    <div><Label htmlFor="accountNumber">{t.accountNumber}</Label><Controller name="accountNumber" control={control} render={({ field }) => <Input id="accountNumber" {...field} />} /></div>
                                </div>
                             )}


                            <div>
                                <Label htmlFor="purpose">{t.purpose}</Label>
                                <Controller name="purpose" control={control} render={({ field }) => <Input id="purpose" {...field} placeholder={t.purpose}/>} />
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
