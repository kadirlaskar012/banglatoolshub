
'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Copy, X, Loader, Wand2, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { createWorker, type Worker } from 'tesseract.js';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ImageToTextOcrConverter() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ছবি নির্বাচন করুন...');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('ben+eng'); // Default to Bengali + English
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const { toast } = useToast();

  const initializeWorker = useCallback(async () => {
    if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
    }
    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
          setStatus(`লেখা শনাক্ত করা হচ্ছে... (${Math.round(m.progress * 100)}%)`);
        } else {
            setStatus(m.status);
        }
      },
    });
    workerRef.current = worker;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    } else {
        toast({
            title: "ভুল ফাইল",
            description: "দয়া করে একটি ইমেজ ফাইল (JPG, PNG) আপলোড করুন।",
            variant: "destructive"
        });
    }
  };
  
  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setText('');
    setProgress(0);
    setStatus('ছবি প্রস্তুত। রূপান্তর করতে বাটনে ক্লিক করুন।');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
        toast({
            title: "কোনো ছবি নেই",
            description: "অনুগ্রহ করে প্রথমে একটি ছবি নির্বাচন করুন।",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    setText('');
    setProgress(0);
    
    try {
      await initializeWorker();
      const worker = workerRef.current;
      if (!worker) throw new Error("Worker not initialized");

      await worker.loadLanguage(language);
      await worker.initialize(language);
      const { data: { text: extractedText } } = await worker.recognize(selectedFile);
      setText(extractedText);
      toast({
        title: "সফল!",
        description: "ছবি থেকে সফলভাবে লেখা বের করা হয়েছে।",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "একটি সমস্যা হয়েছে",
        description: "লেখা শনাক্ত করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
      setStatus('প্রক্রিয়া সম্পন্ন হয়েছে।');
      if (workerRef.current) {
          await workerRef.current.terminate();
          workerRef.current = null;
      }
    }
  };

  const copyToClipboard = () => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    toast({
        title: "কপি হয়েছে!",
        description: "লেখাটি ক্লিপবোর্ডে কপি করা হয়েছে।",
    })
  };

  const clearAll = () => {
    setText('');
    setImagePreview(null);
    setSelectedFile(null);
    setProgress(0);
    setStatus('ছবি নির্বাচন করুন...');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Card 
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg h-80"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg"
                disabled={isLoading}
            />
            {imagePreview ? (
                <img src={imagePreview} alt="Image preview" className="max-h-full rounded-lg object-contain"/>
            ) : (
                <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-12 w-12" />
                    <h3 className="mt-2 font-medium">ছবি এখানে টেনে আনুন বা ক্লিক করে বাছুন</h3>
                    <p className="mt-1 text-xs">PNG, JPG, JPEG</p>
                </div>
            )}
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label className="text-sm font-medium mb-2 block">লেখার ভাষা</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder="ভাষা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ben+eng">বাংলা ও ইংরেজি</SelectItem>
                        <SelectItem value="ben">শুধু বাংলা</SelectItem>
                        <SelectItem value="eng">শুধু ইংরেজি</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-end">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline" disabled={isLoading}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {imagePreview ? "অন্য ছবি বাছুন" : "ছবি বাছুন"}
                </Button>
            </div>
        </div>
         <Button onClick={handleConvert} className="w-full text-lg py-6" disabled={isLoading || !selectedFile}>
            <Wand2 className="mr-2 h-5 w-5" />
            {isLoading ? 'রূপান্তর হচ্ছে...' : 'টেক্সটে রূপান্তর করুন'}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Label className="font-medium flex items-center gap-2">
                <ImageIcon className="w-5 h-5"/>
                শনাক্ত করা টেক্সট
            </Label>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!text || isLoading}>
                    <Copy className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={clearAll} disabled={isLoading}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        </div>
        <Textarea
          placeholder={status}
          value={text}
          readOnly
          className="min-h-[300px] bg-muted/30 text-base"
        />
        {isLoading && (
            <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader className="animate-spin w-4 h-4"/>
                    <p className="text-center font-medium capitalize">{status}</p>
                </div>
                <Progress value={progress} />
            </div>
        )}
      </div>
    </div>
  );
}
