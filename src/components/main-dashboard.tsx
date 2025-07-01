
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, PlusCircle, QrCode, Trash2, Edit, Ticket, Layers, ExternalLink, CreditCard, Mail, Tag, ScrollText } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { VCard, EventTicket } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { TicketMockup } from "@/components/ticket-mockup";
import { useSearch } from "@/context/search-context";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useLogStore } from "@/hooks/use-log-store";

function ActivityLogCard() {
    const { logs, isLoaded } = useLogStore();
    const recentLogs = logs.slice(0, 3);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <ScrollText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="min-h-[72px]">
                {!isLoaded ? (
                    <div className="space-y-2 pt-2">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    </div>
                ) : recentLogs.length > 0 ? (
                    <div className="space-y-3">
                        {recentLogs.map(log => (
                            <div key={log.id} className="text-xs">
                                <p className="font-medium truncate">{log.message}</p>
                                <p className="text-muted-foreground">{log.actor} - {format(log.timestamp, 'p')}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground pt-4">No recent activity to show.</p>
                )}
                </div>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-xs">
                    <Link href="/logs">View all logs</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export function MainDashboard() {
  const { vcards, isLoaded: vcardsLoaded } = useVCardStore();
  const { tickets, isLoaded: ticketsLoaded } = useTicketStore();
  const { searchQuery } = useSearch();

  const [selectedVCardIds, setSelectedVCardIds] = useState<string[]>([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);

  const filteredVcards = vcards.filter(vcard =>
    `${vcard.firstName} ${vcard.lastName} ${vcard.jobTitle} ${vcard.company} ${(vcard.tags || []).join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    `${ticket.eventName} ${ticket.ownerName} ${(ticket.tags || []).join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedVCardIds([]);
    setSelectedTicketIds([]);
  }, [searchQuery]);

  if (!vcardsLoaded || !ticketsLoaded) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-12">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total vCards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vcards.length}</div>
            <p className="text-xs text-muted-foreground">Total vCards created in your account.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">Total event tickets currently active.</p>
          </CardContent>
        </Card>
        <ActivityLogCard />
      </div>
      <VCardSection 
        vcards={filteredVcards} 
        selectedIds={selectedVCardIds}
        onSelectionChange={setSelectedVCardIds}
      />
      <TicketSection 
        tickets={filteredTickets} 
        selectedIds={selectedTicketIds}
        onSelectionChange={setSelectedTicketIds}
      />
    </div>
  );
}


function BulkActionToolbar({ selectedCount, onClear, onDelete, onAddTags }: { selectedCount: number, onClear: () => void, onDelete: () => void, onAddTags: () => void }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between w-full bg-card border rounded-lg p-2 lg:p-3 my-4">
        <div className="text-sm font-medium">
            <span className="text-primary font-bold">{selectedCount}</span> item(s) selected
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAddTags}><Tag className="mr-2 h-4 w-4" /> Add Tags</Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Feature Coming Soon', description: 'Bulk email functionality is not yet available.'})}><Mail className="mr-2 h-4 w-4" /> Send Email</Button>
            <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
        </div>
    </div>
  );
}

function VCardSection({ vcards, selectedIds, onSelectionChange }: { vcards: VCard[], selectedIds: string[], onSelectionChange: (ids: string[]) => void }) {
    const { deleteVCards, addTagsToVCards } = useVCardStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    
    const handleDelete = () => {
        deleteVCards(selectedIds);
        onSelectionChange([]);
        setIsDeleteDialogOpen(false);
    };

    const handleAddTags = (tags: string[]) => {
        addTagsToVCards(selectedIds, tags);
        onSelectionChange([]);
        setIsTagDialogOpen(false);
    }
    
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

            <BulkActionToolbar
                selectedCount={selectedIds.length}
                onClear={() => onSelectionChange([])}
                onDelete={() => setIsDeleteDialogOpen(true)}
                onAddTags={() => setIsTagDialogOpen(true)}
            />

            {vcards.length > 0 ? (
                <div className="mt-4 rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={selectedIds.length === vcards.length && vcards.length > 0 ? true : selectedIds.length > 0 ? 'indeterminate' : false}
                                onCheckedChange={(checked) => onSelectionChange(checked ? vcards.map(v => v.id) : [])}
                            />
                        </TableHead>
                        <TableHead className="w-[60px]">Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Title</TableHead>
                        <TableHead className="hidden md:table-cell">Created By</TableHead>
                        <TableHead className="hidden lg:table-cell">Subscription</TableHead>
                        <TableHead className="hidden lg:table-cell">Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {vcards.map((vcard) => (
                        <VCardTableRow 
                            key={vcard.id} 
                            vcard={vcard} 
                            isSelected={selectedIds.includes(vcard.id)}
                            onToggleSelect={() => {
                                onSelectionChange(selectedIds.includes(vcard.id) 
                                    ? selectedIds.filter(id => id !== vcard.id)
                                    : [...selectedIds, vcard.id]
                                )
                            }}
                        />
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
            <DeleteConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDelete} />
            <AddTagsDialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen} onConfirm={handleAddTags} />
        </div>
    );
}

function TicketSection({ tickets, selectedIds, onSelectionChange }: { tickets: EventTicket[], selectedIds: string[], onSelectionChange: (ids: string[]) => void }) {
    const { deleteTickets, addTagsToTickets } = useTicketStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

    const handleDelete = () => {
        deleteTickets(selectedIds);
        onSelectionChange([]);
        setIsDeleteDialogOpen(false);
    };

    const handleAddTags = (tags: string[]) => {
        addTagsToTickets(selectedIds, tags);
        onSelectionChange([]);
        setIsTagDialogOpen(false);
    }
    
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
            
            <BulkActionToolbar
                selectedCount={selectedIds.length}
                onClear={() => onSelectionChange([])}
                onDelete={() => setIsDeleteDialogOpen(true)}
                onAddTags={() => setIsTagDialogOpen(true)}
            />

            {tickets.length > 0 ? (
                <div className="mt-4 rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedIds.length === tickets.length && tickets.length > 0 ? true : selectedIds.length > 0 ? 'indeterminate' : false}
                                    onCheckedChange={(checked) => onSelectionChange(checked ? tickets.map(t => t.id) : [])}
                                />
                            </TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="hidden md:table-cell">Created By</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden lg:table-cell">Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tickets.map((ticket) => (
                        <TicketTableRow 
                            key={ticket.id} 
                            ticket={ticket} 
                            isSelected={selectedIds.includes(ticket.id)}
                             onToggleSelect={() => {
                                onSelectionChange(selectedIds.includes(ticket.id) 
                                    ? selectedIds.filter(id => id !== ticket.id)
                                    : [...selectedIds, ticket.id]
                                )
                            }}
                        />
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
             <DeleteConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDelete} itemType="tickets" />
             <AddTagsDialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen} onConfirm={handleAddTags} />
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

function VCardTableRow({ vcard, isSelected, onToggleSelect }: { vcard: VCard, isSelected: boolean, onToggleSelect: () => void }) {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const { deleteVCard } = useVCardStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const generateVcf = (card: VCard): string => {
    const parts: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

    parts.push(`N:${card.lastName || ''};${card.firstName || ''};;;`);
    parts.push(`FN:${card.firstName || ''} ${card.lastName || ''}`);

    if (card.jobTitle) parts.push(`TITLE:${card.jobTitle}`);
    
    const orgValue = [card.company, card.department].filter(Boolean).join(';');
    if (orgValue) parts.push(`ORG:${orgValue}`);
    
    (card.phones || []).forEach(p => p.value && parts.push(`TEL;TYPE=CELL:${p.value}`));
    (card.emails || []).forEach(e => e.value && parts.push(`EMAIL:${e.value}`));
    (card.addresses || []).forEach(a => a.value && parts.push(`ADR;TYPE=HOME:;;${a.value};;;`));
    (card.websites || []).forEach(w => w.value && parts.push(`URL:${w.value}`));
    
    (card.socials || []).forEach(s => s.url && s.network && parts.push(`X-SOCIALPROFILE;type=${s.network}:${s.url}`));

    if (card.bio) parts.push(`NOTE:${card.bio.replace(/\n/g, '\\n')}`);
    if (card.profileImageUrl && card.profileImageUrl.startsWith('http')) {
      parts.push(`PHOTO;VALUE=URI:${card.profileImageUrl}`);
    }

    parts.push('END:VCARD');
    return parts.join('\n');
  };

  const vcfData = generateVcf(vcard);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vcfData)}`;

  return (
    <TableRow data-state={isSelected && "selected"}>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
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
      <TableCell className="hidden md:table-cell text-muted-foreground">{vcard.createdBy || 'N/A'}</TableCell>
      <TableCell className="hidden lg:table-cell">
        <Badge
          variant={
            vcard.subscription === 'Enterprise'
              ? 'default'
              : vcard.subscription === 'Top'
              ? 'secondary'
              : 'outline'
          }
        >
          {vcard.subscription}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
            {(vcard.tags || []).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
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
                            deleteVCard(vcard.id);
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

function TicketTableRow({ ticket, isSelected, onToggleSelect }: { ticket: EventTicket, isSelected: boolean, onToggleSelect: () => void }) {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const { deleteTicket } = useTicketStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return (
    <TableRow data-state={isSelected && "selected"}>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-medium">{ticket.eventName}</TableCell>
      <TableCell className="text-muted-foreground">{ticket.ownerName}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{ticket.createdBy || 'N/A'}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {format(new Date(ticket.eventDate), "PPP")}
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
                        deleteTicket(ticket.id);
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
            <DialogHeader>
              <DialogTitle className='sr-only'>Event Ticket</DialogTitle>
              <DialogDescription className='sr-only'>
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

function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, itemType = 'vCards' }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void, itemType?: string }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected {itemType}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">
                        Yes, delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function AddTagsDialog({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: (tags: string[]) => void }) {
    const [tags, setTags] = useState('');

    const handleConfirm = () => {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        if (tagArray.length > 0) {
            onConfirm(tagArray);
            setTags('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Tags</DialogTitle>
                    <DialogDescription>
                        Enter comma-separated tags to add to the selected items.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        value={tags} 
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. Lead, VIP, Conference"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm}>Add Tags</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
