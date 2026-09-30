import type { Product } from "@/types/product";

export function WineCard({ product }: { product: Product }) {
  return <article className="wine-card"><div className={`wine-card__art wine-card__art--${product.tone}`} aria-hidden="true"><div className="wine-card__bottle"><i /><span>CAVA366</span></div><p>{product.varietal}</p></div><div className="wine-card__body"><p>{product.winery}</p><h3>{product.name}</h3><span>{product.varietal} · {product.origin}</span><p className="wine-card__note">{product.note}</p><strong>{product.price}</strong></div></article>;
}
