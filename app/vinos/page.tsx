import type { Metadata } from "next";
import Link from "next/link";
import { WineCard } from "@/components/wine-card";
import styles from "@/components/wine-card.module.css";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Vinos", description: "Una selección de vinos curada por CAVA366." };

export default async function WinesPage() {
  const products = await getPublishedProducts();

  return <main><section className="wines-hero"><div className="shell wines-hero__grid"><div><p className="eyebrow eyebrow--gold">Selección de vinos</p><h1>Botellas con<br />algo para contar.</h1><p>Una selección en movimiento, elegida para descubrir y para volver a servir.</p></div><div className="wines-hero__art" aria-hidden="true"><div /><div /><span>Vinos<br />elegidos</span></div></div></section><section className="section section--cream wines-listing"><div className="shell"><div className="listing-topline"><p>Selección de vinos</p><span>Próximamente, envíos a domicilio</span></div>{products.length ? <div className="wine-grid">{products.map((product) => <WineCard key={product.slug} product={product} />)}</div> : <p className={styles.empty}>No hay vinos publicados por el momento.</p>}</div></section><section className="section section--sand"><div className="shell simple-split"><div><p className="eyebrow">La idea</p><h2>Elegir sin vueltas.</h2></div><div><p>La selección no busca llenar una góndola. Busca acercar botellas que dan ganas de abrir, compartir y recordar.</p><Link className="text-link" href="/contacto">Consultar por vinos <span aria-hidden="true">→</span></Link></div></div></section></main>;
}
