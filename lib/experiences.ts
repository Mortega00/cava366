import { cache } from "react";
import { connection } from "next/server";

import { fallbackExperiences } from "@/data/experiences";
import { getSupabaseClient } from "@/lib/supabase";
import type { Experience, ExperienceStatus } from "@/types/experience";

type SupabaseExperienceRow = {
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
  status: ExperienceStatus;
  capacity_total: number | null;
  spots_available: number | null;
};

const FALLBACK_IMAGE = "/images/cava366-hero.png";

const statusLabels: Record<ExperienceStatus, string> = {
  available: "Disponible",
  last_spots: "Últimos lugares",
  sold_out: "Agotado",
  finished: "Finalizada",
};

function formatExperiencePrice(price: number | null) {
  if (price === null) return "Consultar";
  return `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)}`;
}

function formatExperienceTime(time: string) {
  return time.slice(0, 5);
}

/** Converts the database's snake_case public row into the UI model. */
export function mapExperienceRow(row: SupabaseExperienceRow): Experience {
  const venueName = row.venue_name?.trim() || row.location;
  const location = row.location?.trim() || venueName;

  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    time: formatExperienceTime(row.time),
    venueName,
    location,
    locationLabel: venueName === location ? venueName : `${venueName} · ${location}`,
    price: formatExperiencePrice(row.price),
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    includes: row.includes ?? [],
    image: row.image_url?.trim() || FALLBACK_IMAGE,
    imageUrl: row.image_url?.trim() || null,
    imageAlt: row.title,
    featured: row.featured,
    status: row.status,
    statusLabel: statusLabels[row.status],
    capacityTotal: row.capacity_total,
    spotsAvailable: row.spots_available,
  };
}

export function getExperienceAvailabilityLabel(experience: Pick<Experience, "status" | "spotsAvailable">) {
  if (experience.status === "sold_out") return "Agotado";
  if (experience.status === "finished") return "Finalizada";
  if (experience.spotsAvailable === null) return null;

  if (experience.status === "last_spots") {
    return experience.spotsAvailable === 1 ? "Último lugar" : `Últimos ${experience.spotsAvailable} lugares`;
  }

  return experience.spotsAvailable === 1 ? "1 lugar disponible" : `${experience.spotsAvailable} lugares disponibles`;
}

export function canReserveExperience(experience: Pick<Experience, "status">) {
  return experience.status === "available" || experience.status === "last_spots";
}

export function getExperienceWhatsAppReservationUrl(experience: Pick<Experience, "title" | "date" | "time">) {
  const message = `Hola, quiero reservar para “${experience.title}” del ${formatExperienceDate(experience.date)} a las ${experience.time}. ¿Hay disponibilidad?`;
  return `https://wa.me/5491131031414?text=${encodeURIComponent(message)}`;
}

function reportExperiencesFallback(reason: string, error?: unknown) {
  console.error(`[experiences] Using temporary local fallback: ${reason}`, error ?? "");
}

/**
 * Primary source: public.experiences through the public-read RLS policy.
 * The local mock list is returned only when configuration is missing or the query fails.
 */
export const getPublishedExperiences = cache(async (): Promise<Experience[]> => {
  await connection();
  const supabase = getSupabaseClient();

  if (!supabase) {
    reportExperiencesFallback("missing Supabase environment variables");
    return fallbackExperiences;
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("slug, title, date, time, venue_name, location, price, category, short_description, description, includes, image_url, featured, status, capacity_total, spots_available")
    .eq("published", true)
    .order("date", { ascending: true });

  if (error) {
    reportExperiencesFallback("Supabase returned an error", error);
    return fallbackExperiences;
  }

  return ((data ?? []) as SupabaseExperienceRow[]).map(mapExperienceRow);
});

export const getFeaturedExperiences = cache(async (): Promise<Experience[]> => {
  const experiences = await getPublishedExperiences();
  return experiences.filter((experience) => experience.featured).slice(0, 3);
});

export const getPublishedExperienceBySlug = cache(async (slug: string): Promise<Experience | null> => {
  await connection();
  const supabase = getSupabaseClient();

  if (!supabase) {
    reportExperiencesFallback("missing Supabase environment variables");
    return fallbackExperiences.find((experience) => experience.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("slug, title, date, time, venue_name, location, price, category, short_description, description, includes, image_url, featured, status, capacity_total, spots_available")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    reportExperiencesFallback("Supabase returned an error", error);
    return fallbackExperiences.find((experience) => experience.slug === slug) ?? null;
  }

  return data ? mapExperienceRow(data as SupabaseExperienceRow) : null;
});

function dateOnlyToUtc(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function formatExperienceDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(dateOnlyToUtc(date));
}

export function groupExperiencesByMonth(experiences: Experience[]) {
  return experiences.reduce<Record<string, Experience[]>>((groups, experience) => {
    const month = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(dateOnlyToUtc(experience.date));
    groups[month] ??= [];
    groups[month].push(experience);
    return groups;
  }, {});
}
