
'use client';

import { useEffect, useState } from 'react';
import { useVCardStore } from '@/hooks/use-vcard-store';
import { VCardPublicView } from '@/components/vcard-public-view';
import type { VCard } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';

export default function VCardPage() {
  const params = useParams();
  const id = params.id as string;
  const { getVCardById, isLoaded } = useVCardStore();
  const [vcard, setVCard] = useState<VCard | undefined>(undefined);
  
  useEffect(() => {
    if (isLoaded) {
      const card = getVCardById(id);
      setVCard(card);
    }
  }, [id, getVCardById, isLoaded]);

  if (!isLoaded) {
    return (
       <div className="flex min-h-screen w-full flex-col bg-muted/20">
         <Header />
         <main className="flex flex-1 items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (!vcard) {
    return (
       <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl font-bold">vCard not found</h1>
            <p className="text-muted-foreground">The requested vCard could not be found or has been deleted.</p>
            <Button asChild>
                <Link href="/">Return to Dashboard</Link>
            </Button>
        </main>
      </div>
    );
  }

  return <VCardPublicView vcard={vcard} />;
}
