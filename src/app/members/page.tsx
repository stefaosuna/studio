
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { MoreHorizontal, PlusCircle, Trash2, Edit, QrCode } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useMemberStore } from '@/hooks/use-member-store';
import type { ClubMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function BulkActionToolbar({ selectedCount, onDelete }: { selectedCount: number, onDelete: () => void }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between w-full bg-card border rounded-lg p-2 lg:p-3 my-4">
        <div className="text-sm font-medium">
            <span className="text-primary font-bold">{selectedCount}</span> member(s) selected
        </div>
        <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete Selected</Button>
        </div>
    </div>
  );
}


export default function MembersPage() {
    const { members, isLoaded, deleteMember, deleteMembers } = useMemberStore();
    const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState(false);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<'all' | ClubMember['subscriptionStatus']>('all');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    const filteredMembers = useMemo(() => {
        if (statusFilter === 'all') {
            return members;
        }
        return members.filter(member => member.subscriptionStatus === statusFilter);
    }, [members, statusFilter]);

    const handleDeleteClick = (memberId: string) => {
        setMemberToDelete(memberId);
        setIsSingleDeleteDialogOpen(true);
    };

    const confirmSingleDelete = () => {
        if (memberToDelete) {
            deleteMember(memberToDelete);
            setMemberToDelete(null);
            setIsSingleDeleteDialogOpen(false);
        }
    };

    const handleBulkDelete = () => {
        deleteMembers(selectedMemberIds);
        setSelectedMemberIds([]);
        setIsBulkDeleteDialogOpen(false);
    };

    const toggleSelectUser = (memberId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMemberIds.length === filteredMembers.length) {
            setSelectedMemberIds([]);
        } else {
            setSelectedMemberIds(filteredMembers.map(member => member.id));
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
                            <CardTitle>Club Members</CardTitle>
                            <CardDescription>Manage your club's members and their subscriptions.</CardDescription>
                        </div>
                         <Button asChild>
                            <Link href="/create/member">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Member
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value as any)} className="mb-4">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="Active">Active</TabsTrigger>
                                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                                <TabsTrigger value="Expired">Expired</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <BulkActionToolbar
                            selectedCount={selectedMemberIds.length}
                            onDelete={() => setIsBulkDeleteDialogOpen(true)}
                        />

                         <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={filteredMembers.length > 0 && selectedMemberIds.length === filteredMembers.length}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all rows"
                                            />
                                        </TableHead>
                                        <TableHead className="w-[60px]">Avatar</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Subscription</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Birthday</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                                    <MemberRow 
                                        key={member.id} 
                                        member={member} 
                                        onDeleteClick={handleDeleteClick} 
                                        isSelected={selectedMemberIds.includes(member.id)}
                                        onToggleSelect={() => toggleSelectUser(member.id)}
                                    />
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No members found.
                                        </TableCell>
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <AlertDialog open={isSingleDeleteDialogOpen} onOpenChange={setIsSingleDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the member's record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSingleDelete} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete the {selectedMemberIds.length} selected member(s).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}

function MemberRow({ member, onDeleteClick, isSelected, onToggleSelect }: { member: ClubMember; onDeleteClick: (id: string) => void; isSelected: boolean; onToggleSelect: () => void; }) {
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ memberId: member.id }))}`;
    
    const getStatusVariant = (status: ClubMember['subscriptionStatus']) => {
        switch (status) {
            case 'Active': return 'secondary';
            case 'Inactive': return 'outline';
            case 'Expired': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <TableRow data-state={isSelected && "selected"}>
            <TableCell>
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggleSelect}
                    aria-label={`Select row for ${member.name}`}
                />
            </TableCell>
            <TableCell>
                <Image
                    src={member.profileImageUrl || "https://placehold.co/80x80.png"}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    data-ai-hint="profile picture"
                />
            </TableCell>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>
                <Badge variant="default">{member.subscriptionType}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Badge variant={getStatusVariant(member.subscriptionStatus)}>{member.subscriptionStatus}</Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">{format(new Date(member.birthday), "PPP")}</TableCell>
            <TableCell className="text-right">
                <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem><QrCode className="mr-2 h-4 w-4" />Show QR</DropdownMenuItem>
                            </DialogTrigger>
                             <DropdownMenuItem asChild>
                                <Link href={`/edit/member/${member.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteClick(member.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Member QR Code</DialogTitle>
                            <DialogDescription>
                                Scan this code to check in {member.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                            <Image src={qrUrl} alt="Member QR Code" width={250} height={250} className="h-auto w-full max-w-[250px]" />
                        </div>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}
