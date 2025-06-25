
"use client"

import Image from "next/image";
import { Phone, Mail, MapPin } from 'lucide-react';
import type { VCard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IphoneMockup({ vcard }: { vcard: Partial<VCard> }) {
  const { 
      firstName, lastName, jobTitle, emails, phones, addresses, profileImageUrl, bio, bioSize,
      primaryColor = '#4a00e0',
      secondaryColor = '#FFFFFF' 
  } = vcard;
  const fullName = `${firstName || 'Stefano'} ${lastName || 'Osuna'}`;
  
  const bioSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }[bioSize || 'base'];

  return (
    <div className="relative mx-auto h-[700px] w-[350px] rounded-[48px] border-[10px] border-gray-800 bg-gray-800 shadow-2xl">
      <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-lg bg-gray-800"></div>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-[38px]" style={{ backgroundColor: secondaryColor }}>
        <div className="relative flex min-h-full w-full flex-col">
            <div 
                className="relative flex flex-col items-center px-4 pt-10 pb-16 text-center text-white"
                style={{ backgroundColor: primaryColor }}
            >
                <Image 
                    src={profileImageUrl || 'https://placehold.co/112x112.png'} 
                    alt="Profile"
                    width={112}
                    height={112}
                    className="rounded-full border-4 object-cover"
                    style={{ borderColor: secondaryColor }}
                    data-ai-hint="profile picture"
                />
                <h2 className="mt-4 text-3xl font-bold">{fullName}</h2>
                <p className="mt-1 text-lg opacity-90">{jobTitle || 'Founder'}</p>
            </div>
            
            <div className="relative z-10 -mt-8 flex justify-center gap-4">
                {phones?.[0]?.value && <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><Phone className="h-6 w-6 text-gray-700"/></div>}
                {emails?.[0]?.value && <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><Mail className="h-6 w-6 text-gray-700"/></div>}
                {addresses?.[0]?.value && <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><MapPin className="h-6 w-6 text-gray-700"/></div>}
            </div>
            
            <div className="flex-grow px-8 pt-8 pb-12 text-center text-gray-800">
                <button className="w-full h-12 rounded-lg bg-black text-white font-semibold flex items-center justify-center">
                    Add Contact
                </button>
                <p className={cn("mt-6 leading-relaxed opacity-90", bioSizeClass)}>{bio || "Building the future of digital connections. Passionate about innovation and creating meaningful products."}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
