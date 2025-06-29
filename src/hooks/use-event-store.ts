"use client"

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { toast } from './use-toast';

const EVENTS_STORAGE_KEY = 'proxity-events';

const initialData: Event[] = [
  {
    id: 'evt1',
    name: 'Firebase Dev Summit',
    date: new Date('2024-10-26T09:00:00'),
    location: 'Online',
    tags: ['Conference', 'Dev'],
  },
  {
    id: 'evt2',
    name: 'Next.js Conf',
    date: new Date('2024-11-15T10:00:00'),
    location: 'San Francisco, CA',
    tags: ['Conference', 'Web'],
  },
];

export const useEventStore = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const parsedEvents: Event[] = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map(event => ({
            ...event,
            date: new Date(event.date)
        }));
        setEvents(eventsWithDates);
      } else {
        setEvents(initialData);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load events from localStorage", error);
      setEvents(initialData);
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const addEvent = (event: Omit<Event, 'id' | 'tags'>) => {
    const newEvent: Event = { ...event, id: `evt-${new Date().toISOString()}`, tags: [] };
    const updatedEvents = [newEvent, ...events];
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event created successfully." });
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event updated successfully." });
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event deleted successfully." });
  };

  return { events, isLoaded, getEventById, addEvent, updateEvent, deleteEvent };
};
