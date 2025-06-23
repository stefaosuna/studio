"use client"

import Image from "next/image";
import { Phone, Mail, Globe, MapPin, Linkedin, Twitter, Github, Facebook, Instagram, CaseSensitive } from 'lucide-react';
import type { VCard, SocialNetwork } from "@/lib/types";

const socialIcons: Record<SocialNetwork, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  facebook: Facebook,
  instagram: Instagram,
  website: Globe,
};

export function IphoneMockup({ vcard }: { vcard: Partial<VCard> }) {
  const { firstName, lastName, jobTitle, company, email, phone, website, address, socials, profileImageUrl, department } = vcard;
  const fullName = `${firstName || 'First'} ${lastName || 'Last'}`;
  
  return (
    <div className="relative mx-auto h-[700px] w-[350px] rounded-[48px] border-[10px] border-gray-800 bg-gray-800 shadow-2xl">
      <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-lg bg-gray-800"></div>
      <div className="h-full w-full overflow-hidden rounded-[38px] bg-background">
        <div className="relative h-full w-full">
            {/* Header Image */}
            <div className="h-36 bg-gradient-to-b from-primary/80 to-accent/60"></div>
            
            {/* Profile Picture */}
            <div className="absolute left-1/2 top-20 -translate-x-1/2 transform">
                <Image 
                    src={profileImageUrl || 'https://placehold.co/128x128.png'} 
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-white object-cover shadow-lg"
                    data-ai-hint="profile picture"
                />
            </div>
            
            <div className="p-4 pt-24 text-center">
                <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
                <p className="text-md text-muted-foreground">{jobTitle || 'Job Title'}</p>
                <p className="text-md text-muted-foreground">{company || 'Company Name'}</p>
                <p className="text-sm text-muted-foreground">{department || 'Department'}</p>
            </div>
            
            <div className="px-4 space-y-3 mt-4">
                {phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{phone}</span>
                    </div>
                )}
                 {email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{email}</span>
                    </div>
                )}
                 {website && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{website}</span>
                    </div>
                )}
                 {address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{address}</span>
                    </div>
                )}
            </div>
             
             {socials && socials.length > 0 && (
                <div className="px-4 mt-6">
                    <div className="flex items-center justify-center gap-4">
                        {socials.map(social => {
                            const Icon = socialIcons[social.network] || CaseSensitive;
                            return (
                                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                                    <Icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                </a>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
