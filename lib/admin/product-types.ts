export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  winery: string;
  varietal: string;
  origin: string;
  description: string;
  price: number | null;
  offerPrice: number | null;
  stock: number | null;
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  isOffer: boolean;
  offerLabel: string;
};
