
"use client"

import { useState, useEffect, useCallback } from 'react';
import type { ClubMember, PaymentLogEntry } from '@/lib/types';
import { toast } from './use-toast';
import { addLog } from '@/lib/logger';

const MEMBERS_STORAGE_KEY = 'cardify-club-members';

const initialData: ClubMember[] = [
  {
    id: `member-${Date.now()}-sample1`,
    name: 'Emily White',
    birthday: new Date('1995-05-20'),
    subscriptionType: 'Yearly',
    subscriptionStatus: 'Active',
    profileImageUrl: 'https://placehold.co/200x200.png',
    tags: ['Founding Member'],
    subscriptionDate: new Date('2024-01-15'),
    paymentHistory: [
      { id: `payment-${Date.now()}-1`, date: new Date('2024-01-15'), amount: 120, description: 'Yearly Subscription' },
    ],
  },
  {
    id: `member-${Date.now()}-sample2`,
    name: 'Michael Brown',
    birthday: new Date('1988-11-12'),
    subscriptionType: 'Monthly',
    subscriptionStatus: 'Active',
    profileImageUrl: 'https://placehold.co/200x200.png',
    tags: [],
    subscriptionDate: new Date('2024-06-05'),
     paymentHistory: [
      { id: `payment-${Date.now()}-2`, date: new Date('2024-06-05'), amount: 15, description: 'Monthly Subscription' },
    ],
  },
  {
    id: `member-${Date.now()}-sample3`,
    name: 'Jessica Green',
    birthday: new Date('2001-02-28'),
    subscriptionType: 'Weekly',
    subscriptionStatus: 'Expired',
    profileImageUrl: 'https://placehold.co/200x200.png',
    tags: ['Prospect'],
    subscriptionDate: new Date('2024-05-20'),
    paymentHistory: [
      { id: `payment-${Date.now()}-3`, date: new Date('2024-05-20'), amount: 5, description: 'Weekly Subscription' },
    ],
  },
];

export const useMemberStore = () => {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (storedMembers) {
        const parsedMembers: ClubMember[] = JSON.parse(storedMembers);
        const membersWithDates = parsedMembers.map(member => ({
          ...member,
          birthday: new Date(member.birthday),
          subscriptionDate: member.subscriptionDate ? new Date(member.subscriptionDate) : new Date(),
          paymentHistory: (member.paymentHistory || []).map(log => ({
            ...log,
            date: new Date(log.date)
          }))
        }));
        setMembers(membersWithDates);
      } else {
        setMembers(initialData);
        localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load members from localStorage", error);
      setMembers(initialData);
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (updatedMembers: ClubMember[]) => {
    setMembers(updatedMembers);
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
  };

  const getMemberById = useCallback((id: string) => {
    return members.find(member => member.id === id);
  }, [members]);

  const addMember = (member: Omit<ClubMember, 'id' | 'tags' | 'paymentHistory'>) => {
    const newMember: ClubMember = { ...member, id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, tags: [], paymentHistory: [] };
    const updatedMembers = [newMember, ...members];
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member added successfully." });
    addLog('Demo User', `Created member: ${newMember.name}`);
  };

  const updateMember = (id: string, updatedMember: Partial<Omit<ClubMember, 'paymentHistory'>>) => {
    const memberToUpdate = members.find(m => m.id === id);
    if (!memberToUpdate) return;
    
    const updatedMembers = members.map(member =>
      member.id === id ? { ...member, ...updatedMember } : member
    );
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member updated successfully." });
    addLog('Demo User', `Updated member: ${memberToUpdate.name}`);
  };

  const deleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    if (!memberToDelete) return;

    const updatedMembers = members.filter(member => member.id !== id);
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member deleted successfully." });
    addLog('Demo User', `Deleted member: ${memberToDelete.name}`);
  };
  
  const deleteMembers = (ids: string[]) => {
    const updatedMembers = members.filter(member => !ids.includes(member.id));
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: `${ids.length} member(s) deleted.` });
    addLog('Demo User', `Deleted ${ids.length} member(s)`);
  }

  const addPaymentLog = (memberId: string, payment: Omit<PaymentLogEntry, 'id'>) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newPaymentEntry: PaymentLogEntry = {
        ...payment,
        id: `payment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    const updatedMembers = members.map(m => {
        if (m.id === memberId) {
            const existingHistory = m.paymentHistory || [];
            return { 
                ...m, 
                paymentHistory: [newPaymentEntry, ...existingHistory],
                subscriptionStatus: 'Active' as const,
                subscriptionDate: newPaymentEntry.date
            };
        }
        return m;
    });

    updateStorage(updatedMembers);
    toast({ title: "Payment Recorded", description: `Payment of $${payment.amount.toFixed(2)} was recorded.` });
    addLog('Demo User', `Recorded payment of $${payment.amount.toFixed(2)} for ${member.name}`);
  };

  return { members, isLoaded, getMemberById, addMember, updateMember, deleteMember, deleteMembers, addPaymentLog };
};
