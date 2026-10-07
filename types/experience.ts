export type ExperienceStatus = "available" | "last_spots" | "sold_out" | "finished";

export type Experience = {
  slug: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  location: string;
  locationLabel: string;
  price: string;
  category: string;
  shortDescription: string;
  description: string;
  includes: string[];
  image: string;
  imageUrl?: string | null;
  imageAlt: string;
  featured: boolean;
  status: ExperienceStatus;
  statusLabel: string;
};
