"use client"

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMemberStore } from '@/hooks/use-member-store';
import { MemberForm } from '@/components/member-form';

const formSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  birthday: z.date({ required_error: "A birth date is required." }),
  subscriptionDate: z.date({ required_error: "A subscription start date is required." }),
  profileImageUrl: z.string().url('Invalid URL').optional(),
  subscriptionType: z.enum(['Weekly', 'Monthly', 'Yearly']),
  subscriptionStatus: z.enum(['Active', 'Inactive', 'Expired']),
});

export function MemberEditor({ memberId }: { memberId?: string }) {
  const router = useRouter();
  const { getMemberById, addMember, updateMember } = useMemberStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const existingMember = memberId ? getMemberById(memberId) : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      subscriptionType: 'Monthly',
      subscriptionStatus: 'Active',
      profileImageUrl: 'https://placehold.co/200x200.png',
      subscriptionDate: new Date(),
    },
  });

  useEffect(() => {
    if (existingMember) {
      form.reset({
        ...existingMember,
        birthday: new Date(existingMember.birthday),
        subscriptionDate: existingMember.subscriptionDate ? new Date(existingMember.subscriptionDate) : new Date(),
      });
    }
    setIsMounted(true);
  }, [existingMember, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const memberData = {
        ...values,
        profileImageUrl: values.profileImageUrl || 'https://placehold.co/200x200.png',
    };
    if (memberId && existingMember) {
      updateMember(memberId, memberData);
    } else {
      addMember(memberData);
    }
    router.push('/members');
  };

  if (!isMounted && memberId) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <MemberForm form={form} onSubmit={onSubmit} isEditing={!!memberId} />
    </div>
  );
}
