'use client';

import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useEventStore } from '@/hooks/use-event-store';
import { useTicketStore } from '@/hooks/use-ticket-store';
import type { EventTicket } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, PlusCircle, MoreHorizontal, Edit, Trash2, ExternalLink, QrCode, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TicketMockup } from '@/components/ticket-mockup';
import { TicketLogViewer } from '@/components/ticket-log-viewer';

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    
    const { getEventById, isLoaded: eventsLoaded } = useEventStore();
    const { getTicketsByEventId, isLoaded: ticketsLoaded } = useTicketStore();

    const event = getEventById(id);
    const tickets = getTicketsByEventId(id);

    if (!eventsLoaded || !ticketsLoaded) {
        return (
             <DashboardLayout>
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }
    
    if (!event) {
        return (
             <DashboardLayout>
                <div className="container mx-auto max-w-7xl px-4 py-8 text-center">
                     <h1 className="text-2xl font-bold">Event not found</h1>
                    <p className="text-muted-foreground">The requested event could not be found.</p>
                    <Button asChild className="mt-4">
                        <Link href="/events">Return to Events</Link>
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{event.name}</CardTitle>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(event.date), "PPP")}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Tickets</CardTitle>
                            <CardDescription>All tickets generated for this event.</CardDescription>
                        </div>
                         <Button asChild>
                            <Link href={`/create/ticket?eventId=${event.id}`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Ticket
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Pass Type</TableHead>
                                        <TableHead className="hidden lg:table-cell">Tags</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {tickets.length > 0 ? tickets.map((ticket) => (
                                    <TicketRow key={ticket.id} ticket={ticket} />
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No tickets created for this event yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function TicketRow({ ticket }: { ticket: EventTicket }) {
    const { deleteTicket } = useTicketStore();
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);

    return (
        <TableRow>
            <TableCell className="font-medium">{ticket.ownerName}</TableCell>
            <TableCell>
                <Badge variant={ticket.passType === 'VIP' ? 'default' : 'secondary'}>{ticket.passType}</Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                    {(ticket.tags || []).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/ticket/${ticket.id}`}><ExternalLink className="mr-2 h-4 w-4" />View Ticket</Link>
                                </DropdownMenuItem>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem><QrCode className="mr-2 h-4 w-4" />Show QR</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onSelect={() => setIsLogViewerOpen(true)}>
                                    <Clock className="mr-2 h-4 w-4" />View Logs
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/edit/ticket/${ticket.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete this ticket.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTicket(ticket.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <DialogContent className="w-auto p-0 bg-transparent border-none shadow-none">
                       <TicketMockup ticket={ticket} />
                    </DialogContent>
                </Dialog>
                <TicketLogViewer ticket={ticket} open={isLogViewerOpen} onOpenChange={setIsLogViewerOpen} />
            </TableCell>
        </TableRow>
    );
}
