"use client";

import { deleteExperience } from "@/app/admin/(protected)/experiencias/actions";

export function DeleteExperienceButton({ id, title }: { id: string; title: string }) {
  return <form action={deleteExperience} onSubmit={(event) => { if (!window.confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="admin-action admin-action--danger" type="submit">Eliminar</button></form>;
}
