"use client"

import { useState, useEffect, useCallback } from 'react';
import type { VCard } from '@/lib/types';
import { toast } from './use-toast';

const VCARDS_STORAGE_KEY = 'proxity-vcards';

const initialData: VCard[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Carlson',
    jobTitle: 'Account Manager',
    company: 'Innovate Inc.',
    department: 'Sales',
    phone: '+1 555-100-1000',
    email: 'john.carlson@innovate.co',
    website: 'https://innovate.co',
    address: '123 Main St, Anytown',
    bio: "As an account manager, I thrive on building lasting relationships and helping clients to succeed. Let's connect and grow together!",
    profileImageUrl: 'https://placehold.co/200x200.png',
    socials: [
      { id: '1', network: 'linkedin', url: 'https://linkedin.com/in/johncarlson' },
      { id: '2', network: 'twitter', url: 'https://twitter.com/johncarlson' },
    ],
    primaryColor: '#042f2c',
    secondaryColor: '#ffffff',
    tags: ['Lead', 'Innovate Inc.'],
  },
    {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Lead Engineer',
    company: 'Tech Solutions',
    department: 'Core Infrastructure',
    phone: '+1 987 654 3210',
    email: 'jane.doe@tech.so',
    website: 'https://tech.so',
    address: '456 Code Ave, Silicon Valley',
    bio: 'Innovating and building scalable solutions for the future of tech. Passionate about open source and collaboration.',
    profileImageUrl: 'https://placehold.co/200x200.png',
    socials: [
      { id: '1', network: 'github', url: 'https://github.com/janedoe' },
    ],
    primaryColor: '#527AC9',
    secondaryColor: '#7EC09F',
    tags: ['Tech', 'Core'],
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

  const addVCard = (vcard: Omit<VCard, 'id' | 'tags'>) => {
    const newVCard: VCard = { ...vcard, id: new Date().toISOString(), tags: vcard.company ? [vcard.company] : [] };
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

  const deleteVCards = (ids: string[]) => {
    const updatedVcards = vcards.filter(vcard => !ids.includes(vcard.id));
    updateStorage(updatedVcards);
    toast({ title: "Success!", description: `${ids.length} vCard(s) deleted.` });
  };
  
  const addTagsToVCards = (ids: string[], tagsToAdd: string[]) => {
    const updatedVcards = vcards.map(vcard => {
        if (ids.includes(vcard.id)) {
            const existingTags = vcard.tags || [];
            const newTags = [...new Set([...existingTags, ...tagsToAdd])];
            return { ...vcard, tags: newTags };
        }
        return vcard;
    });
    updateStorage(updatedVcards);
    toast({ title: "Success!", description: `Tags added to ${ids.length} vCard(s).` });
  };

  return { vcards, isLoaded, getVCardById, addVCard, updateVCard, deleteVCard, deleteVCards, addTagsToVCards };
};
