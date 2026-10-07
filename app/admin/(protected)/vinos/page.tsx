import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { getAdminProducts } from "@/lib/admin/products";
import { formatProductPrice } from "@/lib/product-format";
import { toggleProductPublished } from "./actions";

type Props = PageProps<"/admin/vinos">;

function getMessage(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const [products, params] = await Promise.all([getAdminProducts(), searchParams]);
  const success = getMessage(params.success);
  const error = getMessage(params.error);

  return <section className="admin-page"><div className="admin-page__heading"><div><p className="admin-kicker">Catálogo</p><h1>Vinos</h1><p>Administrá las botellas que se muestran en la selección pública de CAVA366.</p></div><Link className="admin-button admin-button--primary" href="/admin/vinos/nuevo">Nuevo vino</Link></div>{success ? <p className="admin-notice admin-notice--success" role="status">{success}</p> : null}{error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Vino</th><th>Bodega</th><th>Varietal</th><th>Precio</th><th>Stock</th><th>Publicada</th><th>Destacada</th><th>Oferta</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{products.map((product) => { const hasActiveOffer = product.isOffer && product.price !== null && product.offerPrice !== null; return <tr key={product.id}><td><strong>{product.name}</strong><small>/{product.slug}</small></td><td>{product.winery || "—"}</td><td>{product.varietal || "—"}</td><td>{hasActiveOffer ? <><strong>Oferta {formatProductPrice(product.offerPrice)}</strong><small>Antes <s>{formatProductPrice(product.price)}</s></small></> : formatProductPrice(product.price)}</td><td>{product.stock ?? "—"}</td><td>{product.published ? "Sí" : "No"}</td><td>{product.featured ? "Sí" : "No"}</td><td>{product.isOffer ? product.offerLabel || "Sí" : "No"}</td><td><div className="admin-row-actions"><Link className="admin-action" href={`/admin/vinos/${product.id}/editar`}>Editar</Link><form action={toggleProductPublished}><input type="hidden" name="id" value={product.id} /><input type="hidden" name="published" value={String(!product.published)} /><button className="admin-action" type="submit">{product.published ? "Despublicar" : "Publicar"}</button></form><DeleteProductButton id={product.id} name={product.name} /></div></td></tr>; })}</tbody></table>{products.length === 0 ? <div className="admin-table-empty">Todavía no hay vinos cargados.</div> : null}</div></section>;
}
