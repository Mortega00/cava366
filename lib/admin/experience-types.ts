import type { ExperienceStatus } from "@/types/experience";

export type AdminExperience = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  location: string;
  price: number | null;
  category: string;
  shortDescription: string;
  description: string;
  includes: string[];
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  status: ExperienceStatus;
};

export const adminStatusOptions: { value: ExperienceStatus; label: string }[] = [
  { value: "available", label: "Disponible" },
  { value: "last_spots", label: "Últimos lugares" },
  { value: "sold_out", label: "Agotado" },
  { value: "finished", label: "Finalizada" },
];

export function getAdminStatusLabel(status: ExperienceStatus) {
  return adminStatusOptions.find((option) => option.value === status)?.label ?? status;
}
