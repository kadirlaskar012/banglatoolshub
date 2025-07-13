'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { transferDataToFirestore } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { devData } from '@/lib/dev-data';

export function DevDataTransfer() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    setIsLoading(true);
    const result = await transferDataToFirestore(devData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleTransfer} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Transfer Dev Data to Firestore
    </Button>
  );
}
