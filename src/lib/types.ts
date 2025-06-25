export type SocialNetwork = 'website' | 'linkedin' | 'twitter' | 'github' | 'instagram' | 'facebook';

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export interface ContactDetail {
  id: string;
  value: string;
}

export type VCardSubscription = 'Basic' | 'Top' | 'Enterprise';
export type BioSize = 'sm' | 'base' | 'lg';

export interface VCard {
  id:string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  department: string;
  phones: ContactDetail[];
  emails: ContactDetail[];
  websites: ContactDetail[];
  addresses: ContactDetail[];
  socials: SocialLink[];
  profileImageUrl: string;
  bio: string;
  bioSize?: BioSize;
  primaryColor: string;
  secondaryColor: string;
  subscription: VCardSubscription;
  tags?: string[];
}

export type PassType = 'VIP' | 'Basic' | 'Staff';

export interface EventTicket {
  id: string;
  eventName: string;
  eventDate: Date;
  ownerName: string;
  passType: PassType;
  tags?: string[];
  color?: string;
}
