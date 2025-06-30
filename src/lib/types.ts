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

export interface Event {
  id: string;
  name: string;
  date: Date;
  location: string;
  tags?: string[];
}

export interface ScanLogEntry {
  id: string;
  timestamp: Date;
  message: string;
}

export interface EventTicket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  ownerName: string;
  passType: PassType;
  publicPrice?: number;
  costPrice?: number;
  tags?: string[];
  color?: string;
  scanLog?: ScanLogEntry[];
}

export type SubscriptionType = 'Weekly' | 'Monthly' | 'Yearly';
export type SubscriptionStatus = 'Active' | 'Inactive' | 'Expired';

export interface PaymentLogEntry {
  id: string;
  date: Date;
  amount: number;
  description: string;
}

export interface ClubMember {
  id: string;
  name: string;
  birthday: Date;
  profileImageUrl?: string;
  subscriptionType: SubscriptionType;
  subscriptionStatus: SubscriptionStatus;
  tags?: string[];
  subscriptionDate: Date;
  paymentHistory?: PaymentLogEntry[];
}
