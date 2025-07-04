
"use client"

import { useState, useEffect, useCallback } from 'react';
import type { EventTicket, ScanLogEntry } from '@/lib/types';
import { toast } from './use-toast';
import { addLog } from '@/lib/logger';

const TICKETS_STORAGE_KEY = 'cardify-tickets';

const initialData: EventTicket[] = [
  {
    id: 'tkt-1719356400000-sample1',
    eventId: 'evt-1719356400000-sample1',
    eventName: 'Firebase Dev Summit',
    eventDate: new Date('2024-10-26T09:00:00'),
    ownerName: 'Alex Johnson',
    passType: 'VIP',
    publicPrice: 150,
    costPrice: 20,
    tags: ['Conference', 'Dev'],
    color: '#6366f1',
    createdBy: 'Demo User',
    scanLog: [
      { id: 'log1', timestamp: new Date('2024-10-26T09:05:00'), message: 'Checked In' },
      { id: 'log2', timestamp: new Date('2024-10-26T11:30:00'), message: 'Accessed VIP Lounge' }
    ],
  },
  {
    id: 'tkt-1719356400000-sample2',
    eventId: 'evt-1719356400000-sample2',
    eventName: 'Next.js Conf',
    eventDate: new Date('2024-11-15T10:00:00'),
    ownerName: 'Samantha Lee',
    passType: 'Basic',
    publicPrice: 50,
    costPrice: 5,
    tags: ['Conference', 'Web'],
    color: '#8b5cf6',
    createdBy: 'Demo User',
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
    const newTicket: EventTicket = { 
      ...ticket, 
      id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, 
      tags: [], 
      color: ticket.color || '#6366f1', 
      scanLog: [],
      publicPrice: ticket.publicPrice || 0,
      costPrice: ticket.costPrice || 0,
    };
    const updatedTickets = [newTicket, ...tickets];
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket created successfully." });
    addLog(newTicket.createdBy || 'System', `Created ticket for ${newTicket.ownerName} in event "${newTicket.eventName}"`);
  };

  const updateTicket = (id: string, updatedTicket: Partial<EventTicket>) => {
    const ticketToUpdate = tickets.find(t => t.id === id);
    if (!ticketToUpdate) return;

    const updatedTickets = tickets.map(ticket =>
      ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
    );
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket updated successfully." });
    addLog('Demo User', `Updated ticket for ${ticketToUpdate.ownerName}`);
  };

  const deleteTicket = (id: string) => {
    const ticketToDelete = tickets.find(t => t.id === id);
    if (!ticketToDelete) return;
    
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: "Ticket deleted successfully." });
    addLog('Demo User', `Deleted ticket for ${ticketToDelete.ownerName}`);
  };

  const deleteTickets = (ids: string[]) => {
    const updatedTickets = tickets.filter(ticket => !ids.includes(ticket.id));
    updateStorage(updatedTickets);
    toast({ title: "Success!", description: `${ids.length} ticket(s) deleted successfully.` });
    addLog('Demo User', `Deleted ${ids.length} ticket(s)`);
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
    addLog('Demo User', `Added tags to ${ids.length} ticket(s)`);
  }
  
  const addScanLogEntry = (ticketId: string, message: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const newLogEntry: ScanLogEntry = {
        id: `log-${new Date().toISOString()}`,
        timestamp: new Date(),
        message,
    };

    const updatedTickets = tickets.map(t => {
        if (t.id === ticketId) {
            const existingLog = t.scanLog || [];
            return { ...t, scanLog: [newLogEntry, ...existingLog] };
        }
        return t;
    });

    updateStorage(updatedTickets);
    toast({ title: "Log Entry Added", description: `"${message}" was added to the ticket's log.` });
    addLog('System', `Added scan log to ticket for ${ticket.ownerName}: "${message}"`);
  };


  return { tickets, isLoaded, getTicketById, addTicket, updateTicket, deleteTicket, deleteTickets, addTagsToTickets, getTicketsByEventId, addScanLogEntry };
};
