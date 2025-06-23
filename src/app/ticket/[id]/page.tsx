
'use client';

import { useEffect, useState } from 'react';
import { useTicketStore } from '@/hooks/use-ticket-store';
import { TicketMockup } from '@/components/ticket-mockup';
import type { EventTicket } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';

export default function TicketPage() {
  const params = useParams();
  const id = params.id as string;
  const { getTicketById, isLoaded } = useTicketStore();
  const [ticket, setTicket] = useState<EventTicket | undefined>(undefined);
  
  useEffect(() => {
    if (isLoaded) {
      const t = getTicketById(id);
      setTicket(t);
    }
  }, [id, getTicketById, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/20">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-muted/20 text-center">
        <h1 className="text-2xl font-bold">Ticket not found</h1>
        <p className="text-muted-foreground">The requested ticket could not be found or has been deleted.</p>
        <Button asChild>
            <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
        <Header />
        <main className="flex flex-1 items-center justify-center py-12">
            <TicketMockup ticket={ticket} />
        </main>
        <footer className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
                Powered by{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                    Cardify
                </Link>
            </p>
        </footer>
    </div>
  );
}
