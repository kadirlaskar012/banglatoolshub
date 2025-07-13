
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Share2, CalendarIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Calendar } from '@/components/ui/calendar';
import { bn } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TotalResult {
    totalYears: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
}

export default function AgeCalculator() {
  const [dob, setDob] = useState<Date | undefined>();
  const [result, setResult] = useState<AgeResult | null>(null);
  const [totalResult, setTotalResult] = useState<TotalResult | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // States for manual input
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (result && dob) {
      timer = setInterval(() => {
        calculateAge(dob, false);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result, dob]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDob(date);
      setDay(String(date.getDate()));
      setMonth(String(date.getMonth() + 1));
      setYear(String(date.getFullYear()));
    }
    setIsCalendarOpen(false);
  }

  const handleManualInputChange = (type: 'day' | 'month' | 'year', value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    
    if (type === 'day') {
      setDay(numValue);
      if (numValue.length === 2) {
        monthRef.current?.focus();
      }
    }
    if (type === 'month') {
      setMonth(numValue);
      if (numValue.length === 2) {
        yearRef.current?.focus();
      }
    }
    if (type === 'year') {
      setYear(numValue);
    }
  };

  useEffect(() => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (
      !isNaN(dayNum) && !isNaN(monthNum) && !isNaN(yearNum) &&
      dayNum > 0 && dayNum <= 31 &&
      monthNum > 0 && monthNum <= 12 &&
      String(year).length === 4
    ) {
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getFullYear() === yearNum && date.getMonth() === monthNum - 1 && date.getDate() === dayNum) {
        setDob(date);
      }
    } else {
        setDob(undefined);
    }
  }, [day, month, year]);


  const calculateAge = (birthDate: Date | undefined, showAlerts = true) => {
    if (!birthDate) {
      setResult(null);
      setTotalResult(null);
      if (showAlerts) toast({ title: "ত্রুটি", description: "দয়া করে আপনার জন্ম তারিখ দিন!", variant: "destructive" });
      return;
    }

    const now = new Date();
    
    if (birthDate > now) {
        setResult(null);
        setTotalResult(null);
        if (showAlerts) toast({ title: "ত্রুটি", description: "জন্ম তারিখ আজকের তারিখের পরে হতে পারে না।", variant: "destructive"});
        return;
    }

    // --- Detailed breakdown calculation ---
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();
    
    if (seconds < 0) { minutes--; seconds += 60; }
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { days--; hours += 24; }
    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) { years--; months += 12; }
    setResult({ years, months, days, hours, minutes, seconds });

    // --- Total summary calculation ---
    const diff = now.getTime() - birthDate.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    const totalYears = now.getFullYear() - birthDate.getFullYear();

    setTotalResult({
        totalYears,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds
    });
  };
  
  const copyToClipboardFallback = (textToShare: string) => {
    navigator.clipboard.writeText(textToShare);
    toast({
        title: "কপি হয়েছে!",
        description: "ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে।",
    });
  };

  const handleShare = async (textToShare: string, title: string) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: textToShare,
                url: window.location.href,
            });
        } catch (error) {
            // Fallback to clipboard if share fails (e.g., user dismisses share sheet)
            // We don't log the error as it's an expected user action (like cancellation).
            copyToClipboardFallback(textToShare);
        }
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboardFallback(textToShare);
    }
  };

  const sharePreciseAge = () => {
    if (!result) return;
    const shareText = `আমার সঠিক বয়স: ${result.years.toLocaleString('bn-BD')} বছর, ${result.months.toLocaleString('bn-BD')} মাস, ${result.days.toLocaleString('bn-BD')} দিন, ${result.hours.toLocaleString('bn-BD')} ঘণ্টা, ${result.minutes.toLocaleString('bn-BD')} মিনিট, এবং ${result.seconds.toLocaleString('bn-BD')} সেকেন্ড! আপনিও আপনার বয়স জানুন:`;
    handleShare(shareText, 'আমার সঠিক বয়স');
  };

  const shareTotalAge = () => {
      if (!totalResult) return;
      const shareText = `আমি পৃথিবীতে মোট ${totalResult.totalDays.toLocaleString('bn-BD')} দিন কাটিয়েছি! আপনিও আপনার জীবনের মোট সময়কাল জানুন:`;
      handleShare(shareText, 'আমার জীবনের মোট সময়');
  };


  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
      <div className="w-full space-y-2 text-center flex flex-col items-center">
        <Label className="text-lg font-medium">আপনার জন্ম তারিখ দিন</Label>

        <Tabs defaultValue="manual" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">ম্যানুয়াল</TabsTrigger>
            <TabsTrigger value="calendar">ক্যালেন্ডার</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="pt-4">
             <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="day" className="text-xs">দিন</Label>
                  <Input ref={dayRef} id="day" placeholder="DD" value={day} onChange={(e) => handleManualInputChange('day', e.target.value)} maxLength={2} />
                </div>
                <div>
                  <Label htmlFor="month" className="text-xs">মাস</Label>
                  <Input ref={monthRef} id="month" placeholder="MM" value={month} onChange={(e) => handleManualInputChange('month', e.target.value)} maxLength={2} />
                </div>
                <div>
                  <Label htmlFor="year" className="text-xs">বছর</Label>
                  <Input ref={yearRef} id="year" placeholder="YYYY" value={year} onChange={(e) => handleManualInputChange('year', e.target.value)} maxLength={4} />
                </div>
              </div>
          </TabsContent>
          <TabsContent value="calendar" className="pt-4">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP", { locale: bn }) : <span>জন্ম তারিখ বাছুন</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={bn}
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
          </TabsContent>
        </Tabs>

      </div>
      
      <Button onClick={() => calculateAge(dob)} size="lg" className="w-full max-w-xs text-lg" disabled={!dob}>
        বয়স গণনা করুন
      </Button>

      {result && (
        <Card className="mt-6 w-full bg-primary/5">
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-headline text-center">আপনার সঠিক বয়স</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.years.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">বছর</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.months.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">মাস</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.days.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">দিন</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.hours.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">ঘন্টা</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.minutes.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">মিনিট</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-inner">
                        <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{result.seconds.toLocaleString('bn-BD')}</p>
                        <p className="text-sm text-muted-foreground">সেকেন্ড</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={sharePreciseAge} variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    ফলাফল শেয়ার করুন
                </Button>
            </CardFooter>
        </Card>
      )}

      {totalResult && (
        <Card className="w-full bg-secondary/30">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-center">মোট সময়</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalMonths.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">মাস</p>
                </div>
                 <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalWeeks.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">সপ্তাহ</p>
                </div>
                 <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalDays.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">দিন</p>
                </div>
                 <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalHours.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">ঘন্টা</p>
                </div>
                 <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalMinutes.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">মিনিট</p>
                </div>
                 <div className="bg-background/80 p-3 rounded-lg text-center">
                    <p className="font-semibold text-lg">{totalResult.totalSeconds.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-muted-foreground">সেকেন্ড</p>
                </div>
            </CardContent>
             <CardFooter className="justify-center">
                <Button onClick={shareTotalAge} variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    ফলাফল শেয়ার করুন
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
