

"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, PlusCircle, QrCode, Trash2, Edit, Ticket, Layers, ExternalLink } from "lucide-react";
import { useVCardStore } from "@/hooks/use-vcard-store";
import { useTicketStore } from "@/hooks/use-ticket-store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { VCard, EventTicket } from "@/lib/types";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { TicketMockup } from "./ticket-mockup";
import { useSearch } from "@/context/search-context";

export function MainDashboard() {
  const { vcards, isLoaded: vcardsLoaded } = useVCardStore();
  const { tickets, isLoaded: ticketsLoaded } = useTicketStore();
  const { searchQuery } = useSearch();

  if (!vcardsLoaded || !ticketsLoaded) {
    return null;
  }
  
  const filteredVcards = vcards.filter(vcard =>
    `${vcard.firstName} ${vcard.lastName} ${vcard.jobTitle} ${vcard.company}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    `${ticket.eventName} ${ticket.ownerName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );


  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-12">
      <VCardSection vcards={filteredVcards} />
      <TicketSection tickets={filteredTickets} />
    </div>
  );
}

function VCardSection({ vcards }: { vcards: VCard[] }) {
    const { deleteVCard } = useVCardStore();
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">My vCards</h2>
                <Button asChild>
                <Link href="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create vCard
                </Link>
                </Button>
            </div>

            {vcards.length > 0 ? (
                <div className="mt-8 rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Title</TableHead>
                        <TableHead className="hidden lg:table-cell">Company</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {vcards.map((vcard) => (
                        <VCardTableRow key={vcard.id} vcard={vcard} onDelete={() => deleteVCard(vcard.id)} />
                    ))}
                    </TableBody>
                </Table>
                </div>
            ) : (
                <EmptyState
                    icon={<Layers className="h-12 w-12 text-muted-foreground" />}
                    title="No vCards yet"
                    description="Get started by creating your first digital business card."
                    buttonLink="/create"
                    buttonText="Create Your First vCard"
                />
            )}
        </div>
    );
}

function TicketSection({ tickets }: { tickets: EventTicket[] }) {
    const { deleteTicket } = useTicketStore();
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">My Event Tickets</h2>
                <Button asChild>
                <Link href="/create/ticket">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Ticket
                </Link>
                </Button>
            </div>

            {tickets.length > 0 ? (
                <div className="mt-8 rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden lg:table-cell">Pass Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tickets.map((ticket) => (
                        <TicketTableRow key={ticket.id} ticket={ticket} onDelete={() => deleteTicket(ticket.id)} />
                    ))}
                    </TableBody>
                </Table>
                </div>
            ) : (
                 <EmptyState
                    icon={<Ticket className="h-12 w-12 text-muted-foreground" />}
                    title="No tickets yet"
                    description="Create your first event ticket with a scannable QR code."
                    buttonLink="/create/ticket"
                    buttonText="Create Your First Ticket"
                />
            )}
        </div>
    );
}

function EmptyState({ icon, title, description, buttonLink, buttonText }: { icon: React.ReactNode, title: string, description: string, buttonLink: string, buttonText: string }) {
    return (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full border border-dashed p-4 bg-card">
                <div className="rounded-full bg-background p-4">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <Button asChild className="mt-2">
                <Link href={buttonLink}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {buttonText}
                </Link>
            </Button>
        </div>
    )
}

function VCardTableRow({ vcard, onDelete }: { vcard: VCard, onDelete: () => void }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const generateVcf = (card: VCard) => {
    const socialLinks = card.socials.map(s => `URL:${s.url}`).join('\\n');
    const orgValue = [card.company, card.department].filter(Boolean).join(';');
    return `BEGIN:VCARD
VERSION:3.0
N:${card.lastName};${card.firstName}
FN:${card.firstName} ${card.lastName}
TITLE:${card.jobTitle}
ORG:${orgValue}
TEL;TYPE=WORK,VOICE:${card.phone}
EMAIL:${card.email}
URL:${card.website}
ADR;TYPE=HOME:;;${card.address}
PHOTO;TYPE=JPEG:${card.profileImageUrl}
${socialLinks}
END:VCARD`;
  };

  const vcfData = generateVcf(vcard);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vcfData)}`;

  return (
    <TableRow>
      <TableCell>
        <Image
          src={vcard.profileImageUrl || "https://placehold.co/80x80.png"}
          alt={`${vcard.firstName} ${vcard.lastName}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
          data-ai-hint="profile picture"
        />
      </TableCell>
      <TableCell className="font-medium">{`${vcard.firstName} ${vcard.lastName}`}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{vcard.jobTitle}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        <div>{vcard.company}</div>
        {vcard.department && <div className="text-xs text-muted-foreground/80">{vcard.department}</div>}
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
                  <Link href={`/vcard/${vcard.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Card
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <QrCode className="mr-2 h-4 w-4" />
                    Show QR
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem asChild>
                  <Link href={`/edit/${vcard.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setIsDeleteDialogOpen(true)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this vCard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                    setIsDeleteDialogOpen(false);
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Scan this code to instantly save {vcard.firstName}'s contact details.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <Image src={qrUrl} alt="vCard QR Code" width={250} height={250} className="h-auto w-full max-w-[250px]" />
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function TicketTableRow({ ticket, onDelete }: { ticket: EventTicket, onDelete: () => void }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  return (
    <TableRow>
      <TableCell className="font-medium">{ticket.eventName}</TableCell>
      <TableCell className="text-muted-foreground">{ticket.ownerName}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {format(new Date(ticket.eventDate), "PPP")}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Badge variant={ticket.passType === 'VIP' ? 'default' : 'secondary'}>{ticket.passType}</Badge>
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
                  <Link href={`/ticket/${ticket.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Ticket
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <QrCode className="mr-2 h-4 w-4" />
                    Show QR
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem asChild>
                  <Link href={`/edit/ticket/${ticket.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setIsDeleteDialogOpen(true)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this ticket.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                    setIsDeleteDialogOpen(false);
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <DialogContent className="w-auto p-0 bg-transparent border-none shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Event Ticket</DialogTitle>
              <DialogDescription>
                Ticket for {ticket.eventName} for {ticket.ownerName}.
              </DialogDescription>
            </DialogHeader>
            <TicketMockup ticket={ticket} />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
