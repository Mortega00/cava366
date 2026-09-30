export type ExperienceCategory = "Arquitectura" | "Gastronomía" | "Música" | "Encuentro";

export type Experience = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: ExperienceCategory;
  shortDescription: string;
  description: string;
  includes: string[];
  image: string;
  imageAlt: string;
  featured: boolean;
};
