'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function OnlineCvResumeBuilder() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');

  const generatePdf = () => {
    // This is a placeholder. In a real application, you would use a library like jsPDF or a backend service.
    alert("একটি নমুনা পিডিএফ তৈরি হবে। আসল কার্যকারিতা যোগ করা প্রয়োজন।");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">পুরো নাম</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">ইমেল</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">ফোন নম্বর</Label>
          <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">ঠিকানা</Label>
          <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">কাজের অভিজ্ঞতা</Label>
        <Textarea id="experience" value={experience} onChange={e => setExperience(e.target.value)} placeholder="পদের নাম, কোম্পানির নাম, সময়কাল..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="education">শিক্ষাগত যোগ্যতা</Label>
        <Textarea id="education" value={education} onChange={e => setEducation(e.target.value)} placeholder="ডিগ্রীর নাম, প্রতিষ্ঠানের নাম, পাশের বছর..." />
      </div>
      <Button onClick={generatePdf}>সিভি ডাউনলোড করুন (PDF)</Button>
    </div>
  );
}
