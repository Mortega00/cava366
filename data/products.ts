import type { Product } from "@/types/product";

/** Temporary contingency only when the public Supabase client is unavailable or its query fails. */
export const fallbackProducts: Product[] = [
  { slug: "tinto-de-altura", name: "Tinto de altura", winery: "Selección de muestra", varietal: "Tinto", origin: "Argentina", description: "Fruta, frescura y una botella para una mesa larga.", price: null, offerPrice: null, imageUrl: null, featured: false, isOffer: false, offerLabel: null, tone: "burgundy" },
  { slug: "blanco-de-paraje", name: "Blanco de paraje", winery: "Selección de muestra", varietal: "Blanco", origin: "Argentina", description: "Una copa con nervio, para abrir cuando baja la tarde.", price: null, offerPrice: null, imageUrl: null, featured: false, isOffer: false, offerLabel: null, tone: "clay" },
  { slug: "criolla-de-mesa", name: "Criolla de mesa", winery: "Selección de muestra", varietal: "Criolla", origin: "Argentina", description: "Ligera, expresiva y fácil de compartir.", price: null, offerPrice: null, imageUrl: null, featured: false, isOffer: false, offerLabel: null, tone: "olive" },
];
