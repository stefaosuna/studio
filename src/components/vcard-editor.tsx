"use client"

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { useVCardStore } from '@/hooks/use-vcard-store';
import { VCardForm } from './vcard-form';
import { IphoneMockup } from './iphone-mockup';
import type { VCard } from '@/lib/types';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid URL').optional(),
  address: z.string().optional(),
  profileImageUrl: z.string().url('Invalid URL').optional(),
  primaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  secondaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  socials: z.array(z.object({
    id: z.string(),
    network: z.enum(['website', 'linkedin', 'twitter', 'github', 'instagram', 'facebook']),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

export function VCardEditor({ vcardId }: { vcardId?: string }) {
  const router = useRouter();
  const { getVCardById, addVCard, updateVCard } = useVCardStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const existingVCard = vcardId ? getVCardById(vcardId) : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      company: '',
      department: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      profileImageUrl: 'https://placehold.co/200x200.png',
      bio: '',
      primaryColor: '#042f2c',
      secondaryColor: '#ffffff',
      socials: [],
    },
  });

  useEffect(() => {
    if (existingVCard) {
      form.reset(existingVCard);
    }
    setIsMounted(true);
  }, [existingVCard, form]);

  const watchedData = useWatch({ control: form.control });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const cardData = {
        ...values,
        jobTitle: values.jobTitle || '',
        company: values.company || '',
        department: values.department || '',
        phone: values.phone || '',
        email: values.email || '',
        website: values.website || '',
        address: values.address || '',
        profileImageUrl: values.profileImageUrl || 'https://placehold.co/200x200.png',
        bio: values.bio || '',
        primaryColor: values.primaryColor || '#042f2c',
        secondaryColor: values.secondaryColor || '#FFFFFF',
        socials: values.socials || [],
    };
    if (vcardId && existingVCard) {
      updateVCard(vcardId, cardData);
    } else {
      addVCard(cardData);
    }
    router.push('/');
  };

  if (!isMounted) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2">
            <VCardForm form={form} onSubmit={onSubmit} isEditing={!!vcardId} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
                <IphoneMockup vcard={watchedData as Partial<VCard>} />
            </div>
        </div>
      </div>
    </div>
  );
}
