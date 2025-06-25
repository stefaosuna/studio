
'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useTicketStore } from '@/hooks/use-ticket-store';
import { toast } from '@/hooks/use-toast';
import type { EventTicket } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Ticket as TicketIcon, Calendar, User, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const QR_READER_ID = "qr-reader";

export function QrScannerDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { getTicketById } = useTicketStore();
    const [scanResult, setScanResult] = useState<EventTicket | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!open) {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(err => {
                    console.error("Failed to stop scanning.", err);
                });
            }
            return;
        }

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        const qrCodeSuccessCallback = (decodedText: string) => {
            try {
                const parsedData = JSON.parse(decodedText);
                if (parsedData && parsedData.id) {
                    const ticket = getTicketById(parsedData.id);
                    if (ticket) {
                        setScanResult(ticket);
                        setScanError(null);
                        toast({ title: "Valid Ticket!", description: `Ticket for ${ticket.ownerName} is valid.` });
                    } else {
                        setScanResult(null);
                        setScanError("Ticket not found in the database.");
                        toast({ variant: "destructive", title: "Invalid Ticket", description: "This QR code does not correspond to a valid ticket." });
                    }
                } else {
                     setScanResult(null);
                     setScanError("Invalid QR code format.");
                }
            } catch (error) {
                 setScanResult(null);
                 setScanError("QR code is not in the correct format.");
                 toast({ variant: "destructive", title: "Scan Error", description: "Could not parse QR code data." });
            }
        };

        const qrCodeErrorCallback = (errorMessage: string) => {
            // This callback can be used for debugging, but is often noisy.
            // console.warn(`QR Code no longer in view. ${errorMessage}`);
        };

        const startScanner = async () => {
            if (!document.getElementById(QR_READER_ID)) {
                return;
            }

            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(QR_READER_ID);
            }
            
            try {
                if (html5QrCodeRef.current.isScanning) {
                    await html5QrCodeRef.current.stop();
                }
                await html5QrCodeRef.current.start(
                    { facingMode: "environment" },
                    config,
                    qrCodeSuccessCallback,
                    qrCodeErrorCallback
                );
            } catch (err) {
                 console.error("Failed to start scanner", err);
                 setScanError("Could not start QR scanner. Please ensure you have a camera and have granted permissions.");
                 toast({ variant: "destructive", title: "Camera Error", description: "Could not access the camera. Please check permissions." });
            }
        };
        
        // Use a small timeout to ensure the dialog and DOM element are ready
        const timer = setTimeout(startScanner, 100);

        return () => {
            clearTimeout(timer);
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(err => console.log('Failed to stop scanner on cleanup', err));
            }
        };

    }, [open, getTicketById]);

    const handleClose = () => {
        setScanResult(null);
        setScanError(null);
        onOpenChange(false);
    }
    
    const resetScanner = () => {
        setScanResult(null);
        setScanError(null);
        if (html5QrCodeRef.current && html5QrCodeRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
            html5QrCodeRef.current.resume();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Validate Ticket QR Code</DialogTitle>
                    <DialogDescription>
                        Point your camera at a ticket's QR code to validate it.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                    <div id={QR_READER_ID} className="w-full rounded-md border" />
                </div>
                {scanResult && (
                    <Alert variant="default" className="border-green-500">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-600">Ticket Valid!</AlertTitle>
                        <AlertDescription>
                            <div className="space-y-2 mt-2">
                                <p className="flex items-center"><TicketIcon className="mr-2 h-4 w-4" /><strong>Event:</strong>&nbsp;{scanResult.eventName}</p>
                                <p className="flex items-center"><User className="mr-2 h-4 w-4" /><strong>Attendee:</strong>&nbsp;{scanResult.ownerName}</p>
                                <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /><strong>Date:</strong>&nbsp;{format(new Date(scanResult.eventDate), "PPP")}</p>
                                <p className="flex items-center"><Star className="mr-2 h-4 w-4" /><strong>Pass:</strong>&nbsp;<Badge variant={scanResult.passType === 'VIP' ? 'default' : 'secondary'}>{scanResult.passType}</Badge></p>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
                {scanError && (
                     <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Validation Failed</AlertTitle>
                        <AlertDescription>{scanError}</AlertDescription>
                    </Alert>
                )}
                <DialogFooter>
                    {(scanResult || scanError) ? (
                        <Button onClick={resetScanner} className="w-full">Scan Another</Button>
                    ): (
                        <Button variant="outline" onClick={handleClose} className="w-full">Close</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
