/**
 * Club information model
 * Represents core club information displayed throughout the site
 */

export interface ClubInfo {
  name: string;
  tagline: string;
  description: string;
  foundingYear: number;
  programs: ProgramInfo[];
  contact: ContactInfo;
  socialMedia: SocialMediaLink[];
}

export interface ProgramInfo {
  name: string;
  description: string;
  icon?: string;
}

export interface ContactInfo {
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
}

export interface SocialMediaLink {
  platform: 'facebook' | 'instagram';
  url: string;
  icon: string;
  ariaLabel?: string;
}
