
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Download,
  QrCode,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VCard, SocialNetwork } from '@/lib/types';
import { cn } from '@/lib/utils';

const socialIcons: Record<SocialNetwork, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
};

const generateVcf = (card: VCard) => {
    const socialLinks = card.socials.map(s => `URL:${s.url}`).join('\\n');
    const orgValue = [card.company, card.department].filter(Boolean).join(';');
    return `BEGIN:VCARD
VERSION:3.0
N:${card.lastName};${card.firstName}
FN:${card.firstName} ${card.lastName}
TITLE:${card.jobTitle}
ORG:${orgValue}
TEL;TYPE=WORK,VOICE:${card.phone}
EMAIL:${card.email}
URL:${card.website}
ADR;TYPE=HOME:;;${card.address}
PHOTO;TYPE=JPEG:${card.profileImageUrl}
${socialLinks}
END:VCARD`;
};

export function VCardPublicView({ vcard }: { vcard: VCard }) {
  const {
    firstName,
    lastName,
    jobTitle,
    company,
    email,
    phone,
    website,
    address,
    profileImageUrl,
    bio,
    bioSize,
    socials,
    primaryColor = '#9F5AFF',
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
  
  const vcfData = generateVcf(vcard);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vcfData)}`;

  const contactDetails = [
    { icon: Phone, label: phone, href: `tel:${phone}` },
    { icon: Mail, label: email, href: `mailto:${email}` },
    { icon: Globe, label: website, href: website, target: '_blank' },
    { icon: MapPin, label: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, target: '_blank' },
  ].filter(detail => detail.label);

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <Image
            src={profileImageUrl || 'https://placehold.co/128x128.png'}
            alt={fullName}
            width={128}
            height={128}
            className="rounded-full border-4 object-cover shadow-lg"
            style={{ borderColor: primaryColor }}
            data-ai-hint="profile picture"
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            {fullName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {jobTitle} {company && `at ${company}`}
          </p>
          {bio && <p className={cn("mt-4 max-w-prose text-foreground/80", bioSizeClass)}>{bio}</p>}

          <Button 
            onClick={handleSaveContact} 
            className="mt-8 h-12 px-8 text-lg" 
            style={{ backgroundColor: primaryColor }}
          >
            <Download className="mr-2 h-5 w-5" />
            Save Contact
          </Button>
        </div>

        {contactDetails.length > 0 && (
            <div className="mt-12 space-y-4">
            {contactDetails.map((item, index) => (
                <a 
                    key={index} 
                    href={item.href} 
                    target={item.target || '_self'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-transform hover:scale-[1.02] hover:shadow-md"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md" style={{ backgroundColor: `${primaryColor}1A`}}>
                        <item.icon className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                </a>
            ))}
            </div>
        )}

        {socials && socials.length > 0 && (
          <div className="mt-12">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Connect with me
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {socials.map((social) => {
                const Icon = socialIcons[social.network];
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.network}
                    className="flex h-14 w-14 items-center justify-center rounded-full border bg-card transition-transform hover:scale-110 hover:shadow-lg"
                  >
                    <Icon className="h-6 w-6 text-foreground/80" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
        
        <Card className="mt-12">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <QrCode className="h-5 w-5 text-muted-foreground" />
                    <span>Scan QR Code</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
                 <Image src={qrUrl} alt="vCard QR Code" width={200} height={200} className="rounded-lg bg-white p-2"/>
            </CardContent>
        </Card>

        <footer className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
                Powered by{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                    Cardify
                </Link>
            </p>
        </footer>
      </main>
    </div>
  );
}
