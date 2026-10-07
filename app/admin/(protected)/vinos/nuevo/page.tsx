import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

type Props = PageProps<"/admin/vinos/nuevo">;

export default async function NewProductPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? error : null;

  return <section className="admin-page admin-page--form"><div className="admin-page__heading"><div><p className="admin-kicker">Nuevo vino</p><h1>Crear vino</h1><p>Completá la información que verá el público cuando el vino esté publicado.</p></div><Link className="admin-button admin-button--secondary" href="/admin/vinos">Volver al listado</Link></div>{message ? <p className="admin-notice admin-notice--error" role="alert">{message}</p> : null}<div className="admin-panel"><ProductForm action={createProduct} submitLabel="Guardar vino" /></div></section>;
}
