import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProduct } from "@/lib/admin/products";
import { updateProduct } from "../../actions";

type Props = PageProps<"/admin/vinos/[id]/editar">;

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const [product, query] = await Promise.all([getAdminProduct(id), searchParams]);
  const success = typeof query.success === "string" ? query.success : null;
  const error = typeof query.error === "string" ? query.error : null;
  const updateForProduct = updateProduct.bind(null, product.id);

  return <section className="admin-page admin-page--form"><div className="admin-page__heading"><div><p className="admin-kicker">Editar vino</p><h1>{product.name}</h1><p>Los cambios se guardan en el vino existente.</p></div><Link className="admin-button admin-button--secondary" href="/admin/vinos">Volver al listado</Link></div>{success ? <p className="admin-notice admin-notice--success" role="status">{success}</p> : null}{error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}<div className="admin-panel"><ProductForm action={updateForProduct} product={product} submitLabel="Guardar cambios" /></div></section>;
}
