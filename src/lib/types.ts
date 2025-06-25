export type SocialNetwork = 'website' | 'linkedin' | 'twitter' | 'github' | 'instagram' | 'facebook';

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export type VCardSubscription = 'Basic' | 'Top' | 'Enterprise';

export interface VCard {
  id:string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  department: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  socials: SocialLink[];
  profileImageUrl: string;
  bio: string;
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
}
