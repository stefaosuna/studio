"use client"

import Image from "next/image";
import { Ticket, User, Calendar, Star } from 'lucide-react';
import type { EventTicket } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export function TicketMockup({ ticket }: { ticket: Partial<EventTicket> }) {
  const { eventName, ownerName, eventDate, passType } = ticket;
  
  return (
    <div className="relative mx-auto w-[350px] bg-card rounded-2xl shadow-2xl overflow-hidden font-sans">
      <div className="bg-primary/80 p-4 text-center">
        <h2 className="text-2xl font-bold text-primary-foreground tracking-wider">{eventName || 'Event Name'}</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Attendee</p>
            <p className="text-lg font-semibold text-foreground">{ownerName || 'Owner Name'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-lg font-semibold text-foreground">
              {eventDate ? format(new Date(eventDate), "PPP") : 'Event Date'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pass Type</p>
            <Badge variant={passType === 'VIP' ? 'default' : 'secondary'} className="text-lg">
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
  );
}
