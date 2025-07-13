'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgeCalculator() {
  const [dob, setDob] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const calculateAge = () => {
    if (!dob) {
      setResult(null);
      alert("দয়া করে আপনার জন্ম তারিখ দিন!");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    // Check for invalid date
    if (birthDate > today) {
        setResult(null);
        alert("জন্ম তারিখ আজকের তারিখের পরে হতে পারে না।");
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get the last day of the previous month
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += lastDayOfPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult(`আপনার বয়স ${years.toLocaleString('bn-BD')} বছর, ${months.toLocaleString('bn-BD')} মাস এবং ${days.toLocaleString('bn-BD')} দিন`);
  };

  // Get today's date in YYYY-MM-DD format for the max attribute of the date input
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
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
        <Card className="mt-6 w-full bg-primary/10 border-primary/50">
            <CardHeader>
                <CardTitle className="text-center text-primary font-headline">ফলাফল</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl text-center font-bold text-primary-foreground">
                    {result}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
