import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import type { ExperienceStatus } from "@/types/experience";
import { type AdminExperience } from "@/lib/admin/experience-types";

export { adminStatusOptions, getAdminStatusLabel, type AdminExperience } from "@/lib/admin/experience-types";

type ExperienceRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venue_name: string;
  location: string;
  price: number | null;
  category: string;
  short_description: string;
  description: string;
  includes: string[] | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  status: ExperienceStatus;
};

const experienceColumns = "id, slug, title, date, time, venue_name, location, price, category, short_description, description, includes, image_url, featured, published, status";

function mapAdminExperience(row: ExperienceRow): AdminExperience {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    time: row.time.slice(0, 5),
    venueName: row.venue_name,
    location: row.location,
    price: row.price,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    includes: row.includes ?? [],
    imageUrl: row.image_url,
    featured: row.featured,
    published: row.published,
    status: row.status,
  };
}

export async function getAdminExperiences(): Promise<AdminExperience[]> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase.from("experiences").select(experienceColumns).order("date", { ascending: true });

  if (error) {
    throw new Error("Could not load admin experiences.");
  }

  return ((data ?? []) as ExperienceRow[]).map(mapAdminExperience);
}

export async function getAdminExperience(id: string): Promise<AdminExperience> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase.from("experiences").select(experienceColumns).eq("id", id).maybeSingle();

  if (error) {
    throw new Error("Could not load the experience.");
  }

  if (!data) {
    notFound();
  }

  return mapAdminExperience(data as ExperienceRow);
}
