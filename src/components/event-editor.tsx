"use client"

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEventStore } from '@/hooks/use-event-store';
import { EventForm } from '@/components/event-form';

const formSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.date({ required_error: "An event date is required." }),
});

export function EventEditor({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const { getEventById, addEvent, updateEvent } = useEventStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const existingEvent = eventId ? getEventById(eventId) : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  useEffect(() => {
    if (existingEvent) {
      form.reset({
        ...existingEvent,
        date: new Date(existingEvent.date)
      });
    }
    setIsMounted(true);
  }, [existingEvent, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (eventId && existingEvent) {
      updateEvent(eventId, values);
    } else {
      addEvent(values);
    }
    router.push('/events');
  };

  if (!isMounted && eventId) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <EventForm form={form} onSubmit={onSubmit} isEditing={!!eventId} />
    </div>
  );
}
