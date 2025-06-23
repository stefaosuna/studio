export type SocialNetwork = 'website' | 'linkedin' | 'twitter' | 'github' | 'instagram' | 'facebook';

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export interface VCard {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  socials: SocialLink[];
  profileImageUrl: string;
}
