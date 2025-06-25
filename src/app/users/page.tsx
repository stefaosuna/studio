
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock user data
const initialUsers = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin' as const, status: 'Active' as const },
  { id: 'u2', name: 'Samantha Lee', email: 'sam.lee@example.com', role: 'Editor' as const, status: 'Active' as const },
  { id: 'u3', name: 'John Carlson', email: 'john.c@example.com', role: 'Viewer' as const, status: 'Inactive' as const },
  { id: 'u4', name: 'Jane Doe', email: 'jane.d@example.com', role: 'Editor' as const, status: 'Active' as const },
];

type User = typeof initialUsers[0];
type UserRole = User['role'];
type UserStatus = User['status'];

function CreateUserDialog({ open, onOpenChange, onCreateUser }: { open: boolean, onOpenChange: (open: boolean) => void, onCreateUser: (user: Omit<User, 'id'>) => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('Viewer');
    const [status, setStatus] = useState<UserStatus>('Active');

    const handleCreate = () => {
        if (name && email) {
            onCreateUser({ name, email, role, status });
            setName('');
            setEmail('');
            setRole('Viewer');
            setStatus('Active');
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new team member.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Create User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function BulkActionToolbar({ selectedCount, onDelete }: { selectedCount: number, onDelete: () => void }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between w-full bg-card border rounded-lg p-2 lg:p-3 my-4">
        <div className="text-sm font-medium">
            <span className="text-primary font-bold">{selectedCount}</span> user(s) selected
        </div>
        <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete Selected</Button>
        </div>
    </div>
  );
}


export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleCreateUser = (newUser: Omit<User, 'id'>) => {
        const userWithId = { ...newUser, id: `u${Date.now()}` };
        setUsers([userWithId, ...users]);
    };

    const handleDeleteSelected = () => {
        setUsers(users.filter(user => !selectedUserIds.includes(user.id)));
        setSelectedUserIds([]);
        setIsDeleteDialogOpen(false);
    }

    const toggleSelectUser = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUserIds.length === users.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(users.map(user => user.id));
        }
    };
    
    return (
        <DashboardLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Administration</CardTitle>
                            <CardDescription>Manage your team members and their roles.</CardDescription>
                        </div>
                         <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create User
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <BulkActionToolbar
                            selectedCount={selectedUserIds.length}
                            onDelete={() => setIsDeleteDialogOpen(true)}
                        />
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                             <Checkbox
                                                checked={selectedUserIds.length > 0 && selectedUserIds.length === users.length}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all rows"
                                            />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} data-state={selectedUserIds.includes(user.id) && "selected"}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUserIds.includes(user.id)}
                                            onCheckedChange={() => toggleSelectUser(user.id)}
                                            aria-label={`Select row for ${user.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant={user.status === 'Active' ? 'secondary' : 'outline'}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
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
            <CreateUserDialog 
                open={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onCreateUser={handleCreateUser}
            />
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected user(s).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
