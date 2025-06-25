'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useEventStore } from '@/hooks/use-event-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useState } from 'react';

export default function EventsPage() {
    const { events, isLoaded, deleteEvent } = useEventStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    const handleDeleteClick = (eventId: string) => {
        setEventToDelete(eventId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (eventToDelete) {
            deleteEvent(eventToDelete);
            setEventToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };

    if (!isLoaded) {
        return (
             <DashboardLayout>
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Events</CardTitle>
                            <CardDescription>Manage your events and their tickets.</CardDescription>
                        </div>
                         <Button asChild>
                            <Link href="/create/event">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Event
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="hidden md:table-cell">Location</TableHead>
                                        <TableHead className="hidden lg:table-cell">Tags</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{event.location}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {(event.tags || []).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                     <DropdownMenuItem asChild>
                                                        <Link href={`/events/${event.id}`}>
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit (soon)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(event.id)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
