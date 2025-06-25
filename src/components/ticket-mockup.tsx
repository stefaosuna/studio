"use client"

import Image from "next/image";
import { Ticket, User, Calendar, Star, Download } from 'lucide-react';
import type { EventTicket } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper function to add alpha to a hex color
const addAlpha = (color: string, opacity: number) => {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase().padStart(2, '0');
};


export function TicketMockup({ ticket, showDownloadButton }: { ticket: Partial<EventTicket>, showDownloadButton?: boolean }) {
  const { eventName, ownerName, eventDate, passType, color } = ticket;
  const ticketRef = useRef<HTMLDivElement>(null);

  const ticketColor = color || '#6366f1';

  const handleDownloadPdf = () => {
    if (!ticketRef.current) return;
    
    html2canvas(ticketRef.current, { 
      backgroundColor: null, // transparent background
      useCORS: true,
      scale: 2 // better resolution
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${eventName || 'event'}-ticket.pdf`);
    });
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={ticketRef} className="relative mx-auto w-[350px] bg-card rounded-2xl shadow-2xl overflow-hidden font-sans">
        <div style={{ backgroundColor: addAlpha(ticketColor, 0.9) }} className="p-4 text-center">
          <h2 style={{ color: '#FFFFFF' }} className="text-2xl font-bold tracking-wider">{eventName || 'Event Name'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: addAlpha(ticketColor, 0.1) }} className="p-3 rounded-full">
              <User style={{ color: ticketColor }} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendee</p>
              <p className="text-lg font-semibold text-foreground">{ownerName || 'Owner Name'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: addAlpha(ticketColor, 0.1) }} className="p-3 rounded-full">
              <Calendar style={{ color: ticketColor }} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-lg font-semibold text-foreground">
                {eventDate ? format(new Date(eventDate), "PPP") : 'Event Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: addAlpha(ticketColor, 0.1) }} className="p-3 rounded-full">
              <Star style={{ color: ticketColor }} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pass Type</p>
              <Badge variant={passType === 'VIP' ? 'default' : 'secondary'} className="text-lg" style={passType === 'VIP' ? { backgroundColor: ticketColor, color: '#FFFFFF' } : {}}>
                  {passType || 'Pass Type'}
              </Badge>
            </div>
          </div>
        </div>
        <Separator className="my-0" />
        <div className="relative p-6 bg-muted/30">
          <div className="absolute top-0 left-0 -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
          <div className="absolute top-0 right-0 -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
          <div className="flex justify-center">
              <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify(ticket))}`}
                  alt="Ticket QR Code"
                  width={150}
                  height={150}
                  className="rounded-lg"
              />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 -translate-y-[-50%] w-8 h-8 bg-background rounded-full"></div>
        <div className="absolute bottom-0 right-0 -translate-y-[-50%] w-8 h-8 bg-background rounded-full"></div>
      </div>
      {showDownloadButton && (
        <Button onClick={handleDownloadPdf} className="w-full max-w-[350px]">
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
      )}
    </div>
  );
}
