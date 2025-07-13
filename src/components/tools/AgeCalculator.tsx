'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { bn } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

export default function AgeCalculator() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!date) {
        setAge(null);
        return;
    };

    const birthDate = new Date(date);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        // Get last day of previous month
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }
    
    setAge({ years, months, days });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
        <div className='flex flex-col items-center space-y-2'>
            <label className="text-lg font-medium text-center">আপনার জন্ম তারিখ নির্বাচন করুন</label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-[280px] justify-start text-left font-normal text-lg p-6",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: bn }) : <span>একটি তারিখ বাছুন</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    disabled={(d) => d > new Date()}
                />
                </PopoverContent>
            </Popover>
        </div>
      <Button onClick={calculateAge} size="lg" disabled={!date}>বয়স গণনা করুন</Button>

      {age && (
        <div className="mt-6 text-center p-6 bg-primary/10 rounded-lg w-full max-w-md">
          <h3 className="text-2xl font-bold mb-4 text-primary">আপনার সঠিক বয়স</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">{age.years.toLocaleString('bn-BD')}</p>
              <p className="text-muted-foreground">বছর</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{age.months.toLocaleString('bn-BD')}</p>
              <p className="text-muted-foreground">মাস</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{age.days.toLocaleString('bn-BD')}</p>
              <p className="text-muted-foreground">দিন</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
