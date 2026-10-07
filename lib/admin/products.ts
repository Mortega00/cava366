import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import type { AdminProduct } from "@/lib/admin/product-types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  winery: string | null;
  varietal: string | null;
  origin: string | null;
  description: string | null;
  price: number | null;
  offer_price: number | null;
  stock: number | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  is_offer: boolean;
  offer_label: string | null;
};

const productColumns = "id, slug, name, winery, varietal, origin, description, price, offer_price, stock, image_url, featured, published, is_offer, offer_label";

function toText(value: string | null) {
  return value?.trim() ?? "";
}

function mapAdminProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    winery: toText(row.winery),
    varietal: toText(row.varietal),
    origin: toText(row.origin),
    description: toText(row.description),
    price: row.price,
    offerPrice: row.offer_price,
    stock: row.stock,
    imageUrl: row.image_url,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    isOffer: Boolean(row.is_offer),
    offerLabel: toText(row.offer_label),
  };
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase.from("products").select(productColumns).order("name", { ascending: true });

  if (error) throw new Error("Could not load admin products.");

  return ((data ?? []) as ProductRow[]).map(mapAdminProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProduct> {
  const { supabase } = await requireAdminUser();
  const { data, error } = await supabase.from("products").select(productColumns).eq("id", id).maybeSingle();

  if (error) throw new Error("Could not load the product.");
  if (!data) notFound();

  return mapAdminProduct(data as ProductRow);
}
