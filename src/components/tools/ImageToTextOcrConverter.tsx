'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function ImageToTextOcrConverter() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleConvert(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = (file: File) => {
    setIsLoading(true);
    setText('');
    
    // Placeholder for actual API call
    setTimeout(() => {
      setText("এটি একটি নমুনা টেক্সট। আপনার আপলোড করা ছবি থেকে লেখা বের করে এখানে দেখানো হবে।");
      setIsLoading(false);
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
        title: "কপি হয়েছে!",
        description: "লেখাটি ক্লিপবোর্ডে কপি করা হয়েছে।",
    })
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={isLoading}
        />
        {imagePreview ? (
            <img src={imagePreview} alt="Image preview" className="max-h-64 rounded-lg object-contain"/>
        ) : (
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">ছবি আপলোড করুন</h3>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP</p>
            </div>
        )}
        <Button onClick={() => fileInputRef.current?.click()} className="mt-4" disabled={isLoading}>
            {isLoading ? "প্রসেসিং..." : (imagePreview ? "অন্য ছবি বাছুন" : "ছবি বাছুন")}
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="font-medium">শনাক্ত করা টেক্সট</label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!text}>
                <Copy className="h-4 w-4 mr-2"/>
                কপি
            </Button>
        </div>
        <Textarea
          placeholder={isLoading ? "ছবি থেকে লেখা বের করা হচ্ছে..." : "এখানে আপনার ছবির লেখাটি আসবে..."}
          value={text}
          readOnly
          className="min-h-[300px] bg-secondary/30"
        />
      </div>
    </div>
  );
}
