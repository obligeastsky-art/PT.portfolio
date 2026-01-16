
export interface PortfolioItem {
  id: string;
  category: 'academic' | 'content' | 'community' | 'project';
  title: string;
  description: string;
  imageUrls: string[];
  date: string;
}

export interface ExperienceItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface EducationItem {
  id: string;
  year: string;
  degree: string;
  institution: string;
}

export interface CertificationItem {
  id: string;
  date: string;
  title: string;
  organization: string;
}

export interface ProfileData {
  name: string;
  profileImageUrl: string;
  headline: string;
  subHeadline: string;
  philosophy: string;
  philosophyHighlight: string;
  email: string;
  phone: string;
  expertise: {
    label: string;
    value: string;
  }[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  portfolioItems: PortfolioItem[];
  certificationImages: string[];
}
