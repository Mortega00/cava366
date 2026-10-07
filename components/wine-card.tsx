import Image from "next/image";
import { formatProductPrice } from "@/lib/product-format";
import type { Product } from "@/types/product";
import styles from "@/components/wine-card.module.css";

export function WineCard({ product }: { product: Product }) {
  const details = [product.varietal, product.origin].filter(Boolean).join(" · ");
  const hasActiveOffer = product.isOffer && product.price !== null && product.offerPrice !== null;

  return <article className="wine-card"><div className={`wine-card__art wine-card__art--${product.tone}${product.imageUrl ? ` ${styles.artImage}` : ""}`}>{product.imageUrl ? <Image src={product.imageUrl} alt={`Botella de ${product.name}`} fill sizes="(max-width: 760px) 100vw, 33vw" className={styles.image} /> : <div className="wine-card__bottle" aria-hidden="true"><i /><span>CAVA366</span></div>}{product.varietal ? <p>{product.varietal}</p> : null}</div><div className="wine-card__body">{product.winery ? <p>{product.winery}</p> : null}<h3>{product.name}</h3>{details ? <span>{details}</span> : null}{product.description ? <p className={`wine-card__note ${styles.note}`}>{product.description}</p> : null}<div className={styles.price}>{product.price === null ? <strong>Consultar</strong> : hasActiveOffer ? <><strong className={styles.offerPrice}>Oferta {formatProductPrice(product.offerPrice)}</strong><span className={styles.previousPrice}>Antes <del>{formatProductPrice(product.price)}</del></span></> : <strong>{formatProductPrice(product.price)}</strong>}{product.isOffer && product.offerLabel ? <span className={styles.offerLabel}>{product.offerLabel}</span> : null}</div></div></article>;
}
