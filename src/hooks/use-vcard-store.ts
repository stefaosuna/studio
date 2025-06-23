"use client"

import { useState, useEffect, useCallback } from 'react';
import type { VCard } from '@/lib/types';
import { toast } from './use-toast';

const VCARDS_STORAGE_KEY = 'cardify-vcards';

const initialData: VCard[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'UX Designer',
    company: 'Innovate Inc.',
    department: 'User Experience',
    phone: '+1 123 456 7890',
    email: 'jane.doe@innovate.co',
    website: 'https://innovate.co',
    address: '123 Design St, Creativity City',
    profileImageUrl: 'https://placehold.co/200x200.png',
    socials: [
      { id: '1', network: 'linkedin', url: 'https://linkedin.com/in/janedoe' },
      { id: '2', network: 'twitter', url: 'https://twitter.com/janedoe' },
    ],
  },
    {
    id: '2',
    firstName: 'John',
    lastName: 'Smith',
    jobTitle: 'Lead Engineer',
    company: 'Tech Solutions',
    department: 'Core Infrastructure',
    phone: '+1 987 654 3210',
    email: 'john.smith@tech.so',
    website: 'https://tech.so',
    address: '456 Code Ave, Silicon Valley',
    profileImageUrl: 'https://placehold.co/200x200.png',
    socials: [
      { id: '1', network: 'github', url: 'https://github.com/johnsmith' },
    ],
  }
];


export const useVCardStore = () => {
  const [vcards, setVcards] = useState<VCard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedVcards = localStorage.getItem(VCARDS_STORAGE_KEY);
      if (storedVcards) {
        setVcards(JSON.parse(storedVcards));
      } else {
        // Load initial data if nothing is in storage
        setVcards(initialData);
        localStorage.setItem(VCARDS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load vCards from localStorage", error);
      setVcards(initialData);
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (updatedVcards: VCard[]) => {
    setVcards(updatedVcards);
    localStorage.setItem(VCARDS_STORAGE_KEY, JSON.stringify(updatedVcards));
  };

  const getVCardById = useCallback((id: string) => {
    return vcards.find(vcard => vcard.id === id);
  }, [vcards]);

  const addVCard = (vcard: Omit<VCard, 'id'>) => {
    const newVCard = { ...vcard, id: new Date().toISOString() };
    const updatedVcards = [newVCard, ...vcards];
    updateStorage(updatedVcards);
    toast({ title: "Success!", description: "vCard created successfully." });
  };

  const updateVCard = (id: string, updatedVcard: Partial<VCard>) => {
    const updatedVcards = vcards.map(vcard =>
      vcard.id === id ? { ...vcard, ...updatedVcard } : vcard
    );
    updateStorage(updatedVcards);
    toast({ title: "Success!", description: "vCard updated successfully." });
  };

  const deleteVCard = (id: string) => {
    const updatedVcards = vcards.filter(vcard => vcard.id !== id);
    updateStorage(updatedVcards);
    toast({ title: "Success!", description: "vCard deleted successfully." });
  };

  return { vcards, isLoaded, getVCardById, addVCard, updateVCard, deleteVCard };
};
