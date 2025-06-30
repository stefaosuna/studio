'use client';

import { useState } from 'react';
import type { ClubMember } from '@/lib/types';
import { useMemberStore } from '@/hooks/use-member-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { DollarSign, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function MemberPaymentLog({ member, open, onOpenChange }: { member: ClubMember, open: boolean, onOpenChange: (open: boolean) => void }) {
    const { addPaymentLog, getMemberById } = useMemberStore();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('Subscription Renewal');
    
    // This makes sure we are always showing the most up-to-date member data from the store
    const currentMember = getMemberById(member.id) || member;

    const handleAddPayment = () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid positive number for the amount.' });
            return;
        }
        if (!description.trim()) {
            toast({ variant: 'destructive', title: 'Invalid Description', description: 'Please enter a description for the payment.' });
            return;
        }

        addPaymentLog(currentMember.id, {
            date: new Date(),
            amount: parsedAmount,
            description: description.trim(),
        });
        
        setAmount('');
        setDescription('Subscription Renewal');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Payment History: {currentMember.name}</DialogTitle>
                    <DialogDescription>
                        Record new payments and view the history for this member. A new payment will renew their subscription.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center"><PlusCircle className="mr-2 h-4 w-4" /> Record New Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="e.g. 15.00"
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g. Monthly Renewal"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleAddPayment} className="w-full">
                                <DollarSign className="mr-2 h-4 w-4" /> Add Payment & Renew
                            </Button>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Payment History</h3>
                        <ScrollArea className="h-60 rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(currentMember.paymentHistory && currentMember.paymentHistory.length > 0) ? (
                                        currentMember.paymentHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                                            <TableRow key={log.id}>
                                                <TableCell>{format(new Date(log.date), "PPP")}</TableCell>
                                                <TableCell>{log.description}</TableCell>
                                                <TableCell className="text-right font-medium">${log.amount.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No payment history found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
