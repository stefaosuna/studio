
"use client"

import { useState, useEffect, useCallback } from 'react';
import type { ClubMember } from '@/lib/types';
import { toast } from './use-toast';

const MEMBERS_STORAGE_KEY = 'proxity-club-members';

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

  const addMember = (member: Omit<ClubMember, 'id' | 'tags'>) => {
    const newMember: ClubMember = { ...member, id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, tags: [] };
    const updatedMembers = [newMember, ...members];
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member added successfully." });
  };

  const updateMember = (id: string, updatedMember: Partial<ClubMember>) => {
    const updatedMembers = members.map(member =>
      member.id === id ? { ...member, ...updatedMember } : member
    );
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member updated successfully." });
  };

  const deleteMember = (id: string) => {
    const updatedMembers = members.filter(member => member.id !== id);
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: "Member deleted successfully." });
  };
  
  const deleteMembers = (ids: string[]) => {
    const updatedMembers = members.filter(member => !ids.includes(member.id));
    updateStorage(updatedMembers);
    toast({ title: "Success!", description: `${ids.length} member(s) deleted.` });
  }

  return { members, isLoaded, getMemberById, addMember, updateMember, deleteMember, deleteMembers };
};
