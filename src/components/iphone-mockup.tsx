"use client"

import Image from "next/image";
import { Phone, Mail, MapPin } from 'lucide-react';
import type { VCard } from "@/lib/types";
import { cn } from "@/lib/utils";

// A simple utility to get a contrasting text color (black or white)
function getContrastingTextColor(hexcolor: string | undefined): string {
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(char => char + char).join('');
  }
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

export function IphoneMockup({ vcard }: { vcard: Partial<VCard> }) {
  const { 
      firstName, lastName, jobTitle, email, phone, address, profileImageUrl, bio, bioSize,
      primaryColor = '#042f2c', 
      secondaryColor = '#FFFFFF' 
  } = vcard;
  const fullName = `${firstName || 'John'} ${lastName || 'Carlson'}`;
  
  const textColor = getContrastingTextColor(primaryColor);
  const buttonIconColor = getContrastingTextColor(secondaryColor);

  const bioSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }[bioSize || 'base'];

  return (
    <div className="relative mx-auto h-[700px] w-[350px] rounded-[48px] border-[10px] border-gray-800 bg-gray-800 shadow-2xl">
      <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-lg bg-gray-800"></div>
      <div className="h-full w-full overflow-hidden rounded-[38px]">
        <div 
            className="relative h-full w-full flex flex-col"
            style={{ backgroundColor: primaryColor, color: textColor }}
        >
            <div className="relative flex flex-col items-center pt-10 text-center">
                <Image 
                    src={profileImageUrl || 'https://placehold.co/128x128.png'} 
                    alt="Profile"
                    width={112}
                    height={112}
                    className="rounded-full border-4 object-cover"
                    style={{ borderColor: secondaryColor }}
                    data-ai-hint="profile picture"
                />
                <h2 className="mt-4 text-3xl font-bold">{fullName}</h2>
                <p className="mt-1 text-lg opacity-90">{jobTitle || 'Account Manager'}</p>
            </div>
            
            <div className="relative z-10 mt-6 flex justify-center gap-4">
                {phone && <div className="h-14 w-14 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: secondaryColor }}><Phone className="h-6 w-6" style={{ color: buttonIconColor }}/></div>}
                {email && <div className="h-14 w-14 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: secondaryColor }}><Mail className="h-6 w-6" style={{ color: buttonIconColor }}/></div>}
                {address && <div className="h-14 w-14 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: secondaryColor }}><MapPin className="h-6 w-6" style={{ color: buttonIconColor }}/></div>}
            </div>
            
            <div className="flex-grow px-8 pt-6 text-center">
                <p className={cn("leading-relaxed opacity-90", bioSizeClass)}>{bio || "As an account manager, I thrive on building lasting relationships and helping clients to succeed. Let's connect and grow together!"}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
