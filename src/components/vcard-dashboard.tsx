"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, PlusCircle, QrCode, Trash2, Edit } from "lucide-react";
import { useVCardStore } from "@/hooks/use-vcard-store";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { VCard } from "@/lib/types";
import { Badge } from "./ui/badge";

export function VCardDashboard() {
  const { vcards, isLoaded, deleteVCard } = useVCardStore();

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">My vCards</h2>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
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
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full border border-dashed p-4 bg-card">
                <div className="rounded-full bg-background p-4">
                    <LayersIcon className="h-12 w-12 text-muted-foreground" />
                </div>
            </div>
            <h3 className="text-2xl font-bold">No vCards yet</h3>
            <p className="text-muted-foreground">Get started by creating your first digital business card.</p>
            <Button asChild className="mt-2">
                <Link href="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Card
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}

function VCardTableRow({ vcard, onDelete }: { vcard: VCard, onDelete: () => void }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const generateVcf = (card: VCard) => {
    const socialLinks = card.socials.map(s => `URL:${s.url}`).join('\\n');
    return `BEGIN:VCARD
VERSION:3.0
N:${card.lastName};${card.firstName}
FN:${card.firstName} ${card.lastName}
TITLE:${card.jobTitle}
ORG:${card.company}
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
          className="rounded-full"
          data-ai-hint="profile picture"
        />
      </TableCell>
      <TableCell className="font-medium">{`${vcard.firstName} ${vcard.lastName}`}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{vcard.jobTitle}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">{vcard.company}</TableCell>
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
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
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
          
          {/* QR Code Dialog */}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Scan this code to instantly save {vcard.firstName}'s contact details.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <Image src={qrUrl} alt="vCard QR Code" width={250} height={250} />
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.84l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84Z" />
      <path d="M2.6 11.92 11.17 16a2 2 0 0 0 1.66 0l8.58-4.08" />
      <path d="m2.6 17.05 8.58 4.09a2 2 0 0 0 1.66 0l8.58-4.09" />
    </svg>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 rounded-md bg-muted"></div>
          <div className="h-10 w-32 rounded-md bg-muted"></div>
        </div>
        <div className="mt-8 h-96 w-full rounded-lg border bg-card"></div>
      </div>
    </div>
  )
}