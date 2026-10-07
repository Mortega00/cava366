import { cache } from "react";
import { connection } from "next/server";
import { fallbackProducts } from "@/data/products";
import { getSupabaseClient } from "@/lib/supabase";
import type { Product, ProductTone } from "@/types/product";

type SupabaseProductRow = {
  slug: string;
  name: string;
  winery: string | null;
  varietal: string | null;
  origin: string | null;
  description: string | null;
  price: number | null;
  offer_price: number | null;
  image_url: string | null;
  featured: boolean;
  is_offer: boolean;
  offer_label: string | null;
};

const productColumns = "slug, name, winery, varietal, origin, description, price, offer_price, image_url, featured, is_offer, offer_label";
const tones: ProductTone[] = ["burgundy", "clay", "olive"];

function getProductTone(slug: string): ProductTone {
  const total = [...slug].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return tones[total % tones.length];
}

function toText(value: string | null) {
  return value?.trim() ?? "";
}

/** Converts the public.products row into the single UI model consumed by /vinos. */
export function mapProductRow(row: SupabaseProductRow): Product {
  const isOffer = Boolean(row.is_offer);

  return {
    slug: row.slug,
    name: row.name,
    winery: toText(row.winery),
    varietal: toText(row.varietal),
    origin: toText(row.origin),
    description: toText(row.description),
    price: row.price,
    offerPrice: row.offer_price,
    imageUrl: toText(row.image_url) || null,
    featured: Boolean(row.featured),
    isOffer,
    offerLabel: isOffer ? toText(row.offer_label) || null : null,
    tone: getProductTone(row.slug),
  };
}

function reportProductsFallback(reason: string, error?: unknown) {
  console.error(`[products] Using temporary local fallback: ${reason}`, error ?? "");
}

/**
 * Primary source: public.products through the public published-only RLS policy.
 * Local mock products are used only when the public client cannot be initialized or the query fails.
 */
export const getPublishedProducts = cache(async (): Promise<Product[]> => {
  await connection();
  const supabase = getSupabaseClient();

  if (!supabase) {
    reportProductsFallback("missing Supabase environment variables");
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    reportProductsFallback("Supabase returned an error", error);
    return fallbackProducts;
  }

  return ((data ?? []) as SupabaseProductRow[]).map(mapProductRow);
});
