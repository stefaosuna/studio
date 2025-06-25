
"use client"

import React from 'react';
import Image from "next/image";
import { Phone, Mail, MapPin, Briefcase, Globe, Linkedin, Twitter, Github, Instagram, Facebook } from 'lucide-react';
import type { VCard, SocialNetwork } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const socialIcons: Record<SocialNetwork, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
};


export function IphoneMockup({ vcard }: { vcard: Partial<VCard> }) {
  const { 
      firstName, lastName, jobTitle, company, emails, phones, addresses, websites, socials, profileImageUrl, bio, bioSize,
      primaryColor = '#4a00e0',
      secondaryColor = '#FFFFFF' 
  } = vcard;
  const fullName = `${firstName || 'Stefano'} ${lastName || 'Osuna'}`;
  
  const bioSizeClass = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base',
  }[bioSize || 'base'];

  const contactDetails = [
    ...(phones || []).map((p, i) => ({ icon: Phone, label: i === 0 ? 'Phone' : `Phone ${i + 1}`, value: p.value })),
    ...(emails || []).map((e, i) => ({ icon: Mail, label: i === 0 ? 'Email' : `Email ${i + 1}`, value: e.value })),
    ...(addresses || []).map((a, i) => ({ icon: MapPin, label: i === 0 ? 'Location' : `Location ${i + 1}`, value: a.value })),
    { icon: Briefcase, label: company, value: jobTitle },
  ].filter(detail => detail.value);

  return (
    <div className="relative mx-auto h-[700px] w-[350px] rounded-[48px] border-[10px] border-gray-800 bg-gray-800 shadow-2xl">
      <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-lg bg-gray-800"></div>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-[38px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ backgroundColor: secondaryColor }}>
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
                <h2 className="mt-4 text-2xl font-bold">{fullName}</h2>
                <p className="mt-1 text-base opacity-90">{jobTitle || 'Founder'}</p>
            </div>
            
            <div className="relative z-10 -mt-8 flex justify-center gap-3">
                {phones?.[0]?.value && <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><Phone className="h-5 w-5 text-gray-700"/></div>}
                {emails?.[0]?.value && <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><Mail className="h-5 w-5 text-gray-700"/></div>}
                {addresses?.[0]?.value && <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg"><MapPin className="h-5 w-5 text-gray-700"/></div>}
            </div>
            
            <div className="flex-grow px-6 pt-6 pb-12 text-left text-gray-800">
                <Button className="w-full h-12 bg-black text-white font-semibold flex items-center justify-center">
                    Add Contact
                </Button>
                {bio && <p className={cn("mt-6 text-center leading-relaxed opacity-90", bioSizeClass)}>{bio || "Building the future of digital connections. Passionate about innovation and creating meaningful products."}</p>}

                {contactDetails.length > 0 && <div className="mt-6">
                  {contactDetails.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-3 py-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <item.icon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className='min-w-0'>
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className="font-semibold text-sm text-gray-800 truncate">{item.value}</p>
                          </div>
                      </div>
                      {index < contactDetails.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>}

                {(websites || []).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-base font-bold text-gray-800">
                      My Websites
                    </h3>
                    <div className="mt-1">
                      {(websites || []).map((site) => (
                        <div key={site.id} className="flex items-center gap-3 py-2 text-sm">
                          <Globe className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          <span className="font-medium text-gray-700 truncate">{site.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {socials && socials.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-base font-bold text-gray-800">
                      Find me on
                    </h3>
                    <div className="mt-1">
                      {socials.map((social) => {
                        const Icon = socialIcons[social.network];
                        const networkName = social.network.charAt(0).toUpperCase() + social.network.slice(1);
                        return (
                          <div key={social.id} className="flex items-center gap-3 py-2 text-sm">
                            <Icon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            <span className="font-medium text-gray-700 truncate">{networkName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}
