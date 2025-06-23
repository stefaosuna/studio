import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Mock user data
const users = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Samantha Lee', email: 'sam.lee@example.com', role: 'Editor', status: 'Active' },
  { id: 'u3', name: 'John Carlson', email: 'john.c@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 'u4', name: 'Jane Doe', email: 'jane.d@example.com', role: 'Editor', status: 'Active' },
];

export default function UsersPage() {
  return (
    <DashboardLayout>
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <Card>
                <CardHeader>
                <CardTitle>User Administration</CardTitle>
                <CardDescription>Manage your team members and their roles.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
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
                </CardContent>
            </Card>
        </div>
    </DashboardLayout>
  );
}
