
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';

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
  const [dob, setDob] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [totalResult, setTotalResult] = useState<TotalResult | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (result) {
      timer = setInterval(() => {
        calculateAge(dob);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result, dob]);

  const calculateAge = (dateString: string) => {
    if (!dateString) {
      setResult(null);
      setTotalResult(null);
      alert("দয়া করে আপনার জন্ম তারিখ দিন!");
      return;
    }

    const birthDate = new Date(dateString);
    const now = new Date();
    
    if (birthDate > now) {
        setResult(null);
        setTotalResult(null);
        alert("জন্ম তারিখ আজকের তারিখের পরে হতে পারে না।");
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

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
      <div className="w-full space-y-2 text-center">
        <Label htmlFor="dob" className="text-lg font-medium">আপনার জন্ম তারিখ</Label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="text-lg p-4 mx-auto max-w-xs"
          max={todayString}
        />
      </div>
      
      <Button onClick={() => calculateAge(dob)} size="lg" className="w-full max-w-xs text-lg">
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
        </Card>
      )}
    </div>
  );
}
