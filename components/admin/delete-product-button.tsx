"use client";

import { deleteProduct } from "@/app/admin/(protected)/vinos/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return <form action={deleteProduct} onSubmit={(event) => { if (!window.confirm(`¿Eliminar “${name}”? Esta acción no se puede deshacer.`)) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="admin-action admin-action--danger" type="submit">Eliminar</button></form>;
}
