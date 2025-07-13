
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AgeCalculator() {
  const [dob, setDob] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (result) {
      timer = setInterval(() => {
        calculateAge();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result, dob]);

  const calculateAge = () => {
    if (!dob) {
      setResult(null);
      alert("দয়া করে আপনার জন্ম তারিখ দিন!");
      return;
    }

    const birthDate = new Date(dob);
    const now = new Date();
    
    if (birthDate > now) {
        setResult(null);
        alert("জন্ম তারিখ আজকের তারিখের পরে হতে পারে না।");
        return;
    }

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();
    
    if (seconds < 0) {
        minutes--;
        seconds += 60;
    }
    if (minutes < 0) {
        hours--;
        minutes += 60;
    }
    if (hours < 0) {
        days--;
        hours += 24;
    }
    if (days < 0) {
        months--;
        const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += lastDayOfPrevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    setResult({ years, months, days, hours, minutes, seconds });
  };

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto">
      <div className="w-full space-y-2">
        <Label htmlFor="dob" className="text-lg font-medium">আপনার জন্ম তারিখ</Label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="text-lg p-4"
          max={todayString}
        />
      </div>
      
      <Button onClick={calculateAge} size="lg" className="w-full text-lg">
        বয়স গণনা করুন
      </Button>

      {result && (
        <Card className="mt-6 w-full bg-primary/5 text-center">
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-headline">আপনার সঠিক বয়স</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.years.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">বছর</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.months.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">মাস</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.days.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">দিন</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.hours.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">ঘন্টা</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.minutes.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">মিনিট</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-primary-foreground">{result.seconds.toLocaleString('bn-BD')}</p>
                        <p className="text-muted-foreground">সেকেন্ড</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
