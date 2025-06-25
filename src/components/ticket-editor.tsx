"use client"

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { useTicketStore } from '@/hooks/use-ticket-store';
import { TicketForm } from '@/components/ticket-form';
import { TicketMockup } from '@/components/ticket-mockup';
import type { EventTicket } from '@/lib/types';

const formSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  passType: z.enum(['VIP', 'Basic', 'Staff'], {
    required_error: "You need to select a pass type.",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional(),
});

export function TicketEditor({ ticketId }: { ticketId?: string }) {
  const router = useRouter();
  const { getTicketById, addTicket, updateTicket } = useTicketStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const existingTicket = ticketId ? getTicketById(ticketId) : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: '',
      ownerName: '',
      passType: 'Basic',
      color: '#6366f1',
    },
  });

  useEffect(() => {
    if (existingTicket) {
      form.reset({
        ...existingTicket,
        eventDate: new Date(existingTicket.eventDate)
      });
    }
    setIsMounted(true);
  }, [existingTicket, form]);

  const watchedData = useWatch({ control: form.control });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (ticketId && existingTicket) {
      updateTicket(ticketId, values);
    } else {
      addTicket(values);
    }
    router.push('/');
  };

  if (!isMounted) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2">
            <TicketForm form={form} onSubmit={onSubmit} isEditing={!!ticketId} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
                <TicketMockup ticket={watchedData as Partial<EventTicket>} showDownloadButton />
            </div>
        </div>
      </div>
    </div>
  );
}
