"use client"

import { useState, useEffect, useCallback } from 'react';
import type { EventTicket, ScanLogEntry } from '@/lib/types';
import { toast } from './use-toast';

const TICKETS_STORAGE_KEY = 'proxity-tickets';

const initialData: EventTicket[] = [
  {
    id: 't1',
    eventId: 'evt1',
    eventName: 'Firebase Dev Summit',
    eventDate: new Date('2024-10-26T09:00:00'),
    ownerName: 'Alex Johnson',
    passType: 'VIP',
    tags: ['Conference', 'Dev'],
    color: '#6366f1',
    scanLog: [
      { id: 'log1', timestamp: new Date('2024-10-26T09:05:00'), message: 'Checked In' },
      { id: 'log2', timestamp: new Date('2024-10-26T11:30:00'), message: 'Accessed VIP Lounge' }
    ],
  },
  {
    id: 't2',
    eventId: 'evt2',
    eventName: 'Next.js Conf',
    eventDate: new Date('2024-11-15T10:00:00'),
    ownerName: 'Samantha Lee',
    passType: 'Basic',
    tags: ['Conference', 'Web'],
    color: '#8b5cf6',
    scanLog: [],
  },
];


export const useTicketStore = () => {
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTickets = localStorage.getItem(TICKETS_STORAGE_KEY);
      if (storedTickets) {
        const parsedTickets: EventTicket[] = JSON.parse(storedTickets);
        const ticketsWithDates = parsedTickets.map(ticket => ({
          ...ticket,
          eventDate: new Date(ticket.eventDate),
          scanLog: (ticket.scanLog || []).map(log => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }))
        }));
        setTickets(ticketsWithDates);
      } else {
        setTickets(initialData);
        localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load tickets from localStorage", error);
      setTickets(initialData);
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (updatedTickets: EventTicket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
  };

  const getTicketById = useCallback((id: string) => {
    return tickets.find(ticket => ticket.id === id);
  }, [tickets]);

  const getTicketsByEventId = useCallback((eventId: string) => {
    return tickets.filter(ticket => ticket.eventId === eventId);
  }, [tickets]);

  const addTicket = (ticket: Omit<EventTicket, 'id' | 'tags' | 'scanLog'>) => {
    const newTicket: EventTicket = { ...ticket, id: `t-${new Date().toISOString()}`, tags: [], color: ticket.color || '#6366f1', scanLog: [] };
    const updatedTickets = [newTicket, ...tickets];
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket created successfully." });
  };

  const updateTicket = (id: string, updatedTicket: Partial<EventTicket>) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
    );
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket updated successfully." });
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket deleted successfully." });
  };

  const deleteTickets = (ids: string[]) => {
    const updatedTickets = tickets.filter(ticket => !ids.includes(ticket.id));
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: `${ids.length} ticket(s) deleted successfully.` });
  }

  const addTagsToTickets = (ids: string[], tagsToAdd: string[]) => {
    const updatedTickets = tickets.map(ticket => {
        if (ids.includes(ticket.id)) {
            const existingTags = ticket.tags || [];
            const newTags = [...new Set([...existingTags, ...tagsToAdd])];
            return { ...ticket, tags: newTags };
        }
        return ticket;
    });
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: `Tags added to ${ids.length} ticket(s).` });
  }
  
  const addScanLogEntry = (ticketId: string, message: string) => {
    const newLogEntry: ScanLogEntry = {
        id: `log-${new Date().toISOString()}`,
        timestamp: new Date(),
        message,
    };

    const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
            const existingLog = ticket.scanLog || [];
            return { ...ticket, scanLog: [newLogEntry, ...existingLog] };
        }
        return ticket;
    });

    updateStorage(updatedTickets);
    toast({ title: "Log Entry Added", description: `"${message}" was added to the ticket's log.` });
  };


  return { tickets, isLoaded, getTicketById, addTicket, updateTicket, deleteTicket, deleteTickets, addTagsToTickets, getTicketsByEventId, addScanLogEntry };
};
