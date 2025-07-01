
"use client"

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { toast } from './use-toast';
import { addLog } from '@/lib/logger';

const EVENTS_STORAGE_KEY = 'cardify-events';

const initialData: Event[] = [
  {
    id: 'evt-1719356400000-sample1',
    name: 'Firebase Dev Summit',
    date: new Date('2024-10-26T09:00:00'),
    location: 'Online',
    tags: ['Conference', 'Dev'],
  },
  {
    id: 'evt-1719356400000-sample2',
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
    const newEvent: Event = { ...event, id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, tags: [] };
    const updatedEvents = [newEvent, ...events];
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event created successfully." });
    addLog('Demo User', `Created event: "${newEvent.name}"`);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    const eventToUpdate = events.find(event => event.id === id);
    if (!eventToUpdate) return;

    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event updated successfully." });
    addLog('Demo User', `Updated event: "${eventToUpdate.name}"`);
  };

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find(event => event.id === id);
    if (!eventToDelete) return;

    const updatedEvents = events.filter(event => event.id !== id);
    updateStorage(updatedEvents);
    toast({ title: "Success!", description: "Event deleted successfully." });
    addLog('Demo User', `Deleted event: "${eventToDelete.name}"`);
  };

  return { events, isLoaded, getEventById, addEvent, updateEvent, deleteEvent };
};
