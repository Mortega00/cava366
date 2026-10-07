"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { adminStatusOptions, type AdminExperience } from "@/lib/admin/experience-types";

type ExperienceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  experience?: AdminExperience;
  submitLabel: string;
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ExperienceForm({ action, experience, submitLabel }: ExperienceFormProps) {
  const initialTitle = experience?.title ?? "";
  const initialSlug = experience?.slug ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [slugEdited, setSlugEdited] = useState(Boolean(experience) && initialSlug !== slugify(initialTitle));

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  return <form action={action} className="admin-form admin-experience-form"><div className="admin-form__grid"><label className="admin-form__wide">Título<input name="title" value={title} onChange={(event) => handleTitleChange(event.target.value)} required /></label><label className="admin-form__wide">Slug<input name="slug" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Se genera desde el título, pero podés editarlo.</small></label><label>Fecha<input name="date" type="date" defaultValue={experience?.date} required /></label><label>Hora<input name="time" type="time" defaultValue={experience?.time} required /></label><label>Nombre del lugar<input name="venue_name" defaultValue={experience?.venueName} required /></label><label>Ubicación<input name="location" defaultValue={experience?.location} required /></label><label>Valor<input name="price" type="number" min="0" step="1" defaultValue={experience?.price ?? ""} /><small>Dejá vacío si es a consultar.</small></label><label>Categoría<input name="category" defaultValue={experience?.category} required /></label><label>Estado<select name="status" defaultValue={experience?.status ?? "available"}>{adminStatusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label><label>Cupos totales<input name="capacity_total" type="number" min="0" step="1" defaultValue={experience?.capacityTotal ?? ""} /><small>Dejá vacío si todavía no definiste un cupo.</small></label><label>Lugares disponibles<input name="spots_available" type="number" min="0" step="1" defaultValue={experience?.spotsAvailable ?? ""} /><small>No puede superar los cupos totales.</small></label><ImageUploadField inputId="experience-image" imageUrl={experience?.imageUrl} subject="esta experiencia" /><label className="admin-form__wide">Descripción breve<textarea name="short_description" defaultValue={experience?.shortDescription} rows={3} required /></label><label className="admin-form__wide">Descripción<textarea name="description" defaultValue={experience?.description} rows={6} required /></label><label className="admin-form__wide">Incluye<textarea name="includes" defaultValue={experience?.includes.join("\n")} rows={5} /><small>Un ítem por línea.</small></label></div><div className="admin-form__checks"><label><input name="featured" type="checkbox" defaultChecked={experience?.featured} /> Destacada</label><label><input name="published" type="checkbox" defaultChecked={experience?.published} /> Publicada</label></div><div className="admin-form__actions"><button className="admin-button admin-button--primary" type="submit">{submitLabel}</button></div></form>;
}
