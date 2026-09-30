import type { Product } from "@/types/product";

export const products: Product[] = [
  { slug: "tinto-de-altura", name: "Tinto de altura", winery: "Selección de muestra", varietal: "Tinto", origin: "Argentina", note: "Fruta, frescura y una botella para una mesa larga.", price: "Precio a consultar", tone: "burgundy" },
  { slug: "blanco-de-paraje", name: "Blanco de paraje", winery: "Selección de muestra", varietal: "Blanco", origin: "Argentina", note: "Una copa con nervio, para abrir cuando baja la tarde.", price: "Precio a consultar", tone: "clay" },
  { slug: "criolla-de-mesa", name: "Criolla de mesa", winery: "Selección de muestra", varietal: "Criolla", origin: "Argentina", note: "Ligera, expresiva y fácil de compartir.", price: "Precio a consultar", tone: "olive" },
];
