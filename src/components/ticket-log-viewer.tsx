
'use client';

import { useState, useEffect } from 'react';
import { useTicketStore } from '@/hooks/use-ticket-store';
import type { EventTicket, ScanLogEntry } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanHistory } from './scan-history';

export function TicketLogViewer({ ticket: initialTicket, open, onOpenChange }: { ticket: EventTicket, open: boolean, onOpenChange: (open: boolean) => void }) {
    const { addScanLogEntry } = useTicketStore();
    const [ticket, setTicket] = useState(initialTicket);

    useEffect(() => {
        setTicket(initialTicket);
    }, [initialTicket]);

    const handleAddLog = (message: string) => {
        const newLogEntry: ScanLogEntry = {
            id: `log-${new Date().toISOString()}`,
            timestamp: new Date(),
            message: message,
        };
        const updatedLog = [newLogEntry, ...(ticket.scanLog || [])];
        setTicket({ ...ticket, scanLog: updatedLog });

        addScanLogEntry(ticket.id, message);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ticket Log: {ticket.ownerName}</DialogTitle>
                    <DialogDescription>
                        View and manage the scan history for the ticket to "{ticket.eventName}".
                    </DialogDescription>
                </DialogHeader>
                <ScanHistory scanLog={ticket.scanLog} onAddLog={handleAddLog} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
