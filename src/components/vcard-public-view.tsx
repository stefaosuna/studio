
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Globe, Download, Linkedin, Twitter, Github, Instagram, Facebook, Briefcase, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VCard, SocialNetwork } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const socialIcons: Record<SocialNetwork, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
};

const generateVcf = (card: VCard): string => {
  const parts: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  // Name
  parts.push(`N:${card.lastName || ''};${card.firstName || ''};;;`);
  parts.push(`FN:${card.firstName || ''} ${card.lastName || ''}`);

  // Work
  if (card.jobTitle) parts.push(`TITLE:${card.jobTitle}`);
  const orgValue = [card.company, card.department].filter(Boolean).join(';');
  if (orgValue) parts.push(`ORG:${orgValue}`);

  // Contact
  (card.phones || []).forEach(p => p.value && parts.push(`TEL;TYPE=CELL:${p.value}`));
  (card.emails || []).forEach(e => e.value && parts.push(`EMAIL:${e.value}`));
  (card.addresses || []).forEach(a => a.value && parts.push(`ADR;TYPE=HOME:;;${a.value};;;`));
  (card.websites || []).forEach(w => w.value && parts.push(`URL:${w.value}`));
  
  // Social
  (card.socials || []).forEach(s => s.url && s.network && parts.push(`X-SOCIALPROFILE;type=${s.network}:${s.url}`));

  // Other
  if (card.bio) parts.push(`NOTE:${card.bio.replace(/\n/g, '\\n')}`);
  if (card.profileImageUrl && card.profileImageUrl.startsWith('http')) {
    parts.push(`PHOTO;VALUE=URI:${card.profileImageUrl}`);
  }

  parts.push('END:VCARD');
  return parts.join('\n');
};

export function VCardPublicView({ vcard }: { vcard: VCard }) {
  const {
    firstName,
    lastName,
    jobTitle,
    company,
    emails,
    phones,
    websites,
    addresses,
    profileImageUrl,
    bio,
    bioSize,
    socials,
    primaryColor = '#4a00e0',
    secondaryColor = '#FFFFFF',
  } = vcard;

  const fullName = `${firstName} ${lastName}`;

  const bioSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }[bioSize || 'base'];

  const handleSaveContact = () => {
    const vcfData = generateVcf(vcard);
    const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${firstName}_${lastName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: secondaryColor }}>
      <div 
        className="relative w-full text-white text-center pt-10 pb-20"
        style={{ backgroundColor: primaryColor }}
      >
        <Image
          src={profileImageUrl || 'https://placehold.co/128x128.png'}
          alt={fullName}
          width={128}
          height={128}
          className="rounded-full border-4 object-cover shadow-lg mx-auto"
          style={{ borderColor: secondaryColor }}
          data-ai-hint="profile picture"
        />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
          {fullName}
        </h1>
        <p className="mt-2 text-lg text-white/90">
          {jobTitle}
        </p>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-5 z-10">
          {phones?.[0]?.value && <a href={`tel:${phones[0].value}`} className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"><Phone className="h-6 w-6 text-gray-800" /></a>}
          {emails?.[0]?.value && <a href={`mailto:${emails[0].value}`} className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"><Mail className="h-6 w-6 text-gray-800" /></a>}
          {addresses?.[0]?.value && <a href={`https://maps.google.com/?q=${encodeURIComponent(addresses[0].value)}`} target="_blank" rel="noopener noreferrer" className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"><MapPin className="h-6 w-6 text-gray-800" /></a>}
        </div>
      </div>
      
      <main className="pt-16 pb-12" style={{ backgroundColor: secondaryColor }}>
        <div className="container mx-auto max-w-2xl px-4">
          <Button 
            onClick={handleSaveContact} 
            className="w-full h-14 bg-black text-white text-lg font-semibold hover:bg-gray-800"
          >
            <Download className="mr-2 h-5 w-5" />
            Add Contact
          </Button>

          {bio && <p className={cn("mt-8 text-center max-w-prose mx-auto text-gray-600", bioSizeClass)}>{bio}</p>}

          <div className="mt-8 space-y-2">
            {jobTitle && company && (
              <>
                <div className="flex items-center gap-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Briefcase className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{jobTitle}</p>
                      <p className="font-semibold text-gray-800">{company}</p>
                    </div>
                </div>
                <Separator/>
              </>
            )}
            {(phones || []).map((item, index) => (
              <React.Fragment key={item.id}>
                <a href={`tel:${item.value}`} className="flex items-center gap-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Phone className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{index === 0 ? "Phone" : `Phone ${index + 1}`}</p>
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    </div>
                </a>
                <Separator/>
              </React.Fragment>
            ))}
             {(emails || []).map((item, index) => (
              <React.Fragment key={item.id}>
                <a href={`mailto:${item.value}`} className="flex items-center gap-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Mail className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{index === 0 ? "Email" : `Email ${index + 1}`}</p>
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    </div>
                </a>
                <Separator/>
              </React.Fragment>
            ))}
             {(addresses || []).map((item, index) => (
              <React.Fragment key={item.id}>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(item.value)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <MapPin className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{index === 0 ? "Address" : `Address ${index + 1}`}</p>
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    </div>
                </a>
                <Separator/>
              </React.Fragment>
            ))}
          </div>
          
          {(websites || []).length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-800">
                My Websites
              </h2>
              <div className="mt-2 -mx-4">
                {(websites || []).map((site) => (
                  <a
                    key={site.id}
                    href={site.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50"
                  >
                    <Globe className="h-8 w-8 text-gray-600" />
                    <span className="font-semibold text-gray-800 flex-1">{site.value}</span>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {socials && socials.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-800">
                Find me on
              </h2>
              <div className="mt-2 -mx-4">
                {socials.map((social) => {
                  const Icon = socialIcons[social.network];
                  const networkName = social.network.charAt(0).toUpperCase() + social.network.slice(1);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50"
                    >
                      <Icon className="h-8 w-8 text-gray-600" />
                      <span className="font-semibold text-gray-800 flex-1">{networkName}</span>
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          <footer className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                  Powered by{' '}
                  <Link href="/" className="font-medium hover:underline" style={{ color: primaryColor }}>
                      Proxity
                  </Link>
              </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
