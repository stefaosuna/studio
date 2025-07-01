
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useLogStore } from '@/hooks/use-log-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ScrollText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

function LogSkeleton() {
    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-8">
                        <div className="h-10 w-64 rounded-md bg-muted"></div>
                        <div className="h-10 w-32 rounded-md bg-muted"></div>
                    </div>
                    <div className="h-[600px] w-full rounded-lg border bg-card"></div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default function LogsPage() {
    const { logs, isLoaded, clearLogs } = useLogStore();
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    if (!isLoaded) {
        return <LogSkeleton />;
    }

    const handleClearLogs = () => {
        clearLogs();
        setIsClearDialogOpen(false);
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Application Log</CardTitle>
                            <CardDescription>A chronological record of all activities within the app.</CardDescription>
                        </div>
                        <Button variant="destructive" onClick={() => setIsClearDialogOpen(true)} disabled={logs.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear Logs
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                                    <TableRow>
                                        <TableHead className="w-[200px]">Timestamp</TableHead>
                                        <TableHead className="w-[150px]">Actor</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length > 0 ? (
                                        logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-muted-foreground">{format(log.timestamp, 'Pp')}</TableCell>
                                                <TableCell className="font-medium">{log.actor}</TableCell>
                                                <TableCell>{log.message}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center">
                                                <ScrollText className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-semibold">No Logs Found</h3>
                                                <p className="text-muted-foreground">Activities will be logged here as they happen.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all application logs.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearLogs} className="bg-destructive hover:bg-destructive/90">
                            Yes, clear all logs
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
