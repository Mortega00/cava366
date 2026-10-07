"use client";

import { useEffect, useRef, useState } from "react";
import { adminStatusOptions, type AdminExperience } from "@/lib/admin/experience-types";

type ExperienceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  experience?: AdminExperience;
  submitLabel: string;
};

const maxImageBytes = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const acceptedImageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function validateImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!file.name || !Number.isFinite(file.size) || file.size < 0) return "No pudimos leer el archivo seleccionado.";
  if (file.size === 0) return "El archivo está vacío. Elegí una imagen con contenido.";
  if (!acceptedImageExtensions.has(extension)) return "La extensión del archivo no es compatible. Usá JPG, JPEG, PNG o WEBP.";
  if (!file.type) return "No pudimos identificar el formato del archivo. Elegí una imagen JPG, JPEG, PNG o WEBP.";
  if (!acceptedImageTypes.has(file.type)) return "El formato de esta imagen no es compatible. Usá JPG, JPEG, PNG o WEBP.";
  if (file.size > maxImageBytes) return "La imagen supera el tamaño permitido de 5 MB.";

  return null;
}

function logClientImageValidation(file: File, error: string) {
  if (process.env.NODE_ENV !== "development") return;

  console.error("[admin] Experience image client validation failed", {
    file: { name: file.name, extension: file.name.split(".").pop()?.toLowerCase() ?? "", type: file.type, size: file.size },
    error,
  });
}

export function ExperienceForm({ action, experience, submitLabel }: ExperienceFormProps) {
  const initialTitle = experience?.title ?? "";
  const initialSlug = experience?.slug ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [slugEdited, setSlugEdited] = useState(Boolean(experience) && initialSlug !== slugify(initialTitle));
  const [imagePreview, setImagePreview] = useState<string | null>(experience?.imageUrl ?? null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      logClientImageValidation(file, error);
      setImageError(error);
      event.target.value = "";
      return;
    }

    clearObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setImagePreview(previewUrl);
    setImageName(file.name);
    setImageError(null);
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    clearObjectUrl();
    setImagePreview(null);
    setImageName(null);
    setImageError(null);
    setRemoveImage(Boolean(experience?.imageUrl));
    if (inputRef.current) inputRef.current.value = "";
  }

  return <form action={action} className="admin-form admin-experience-form"><div className="admin-form__grid"><label className="admin-form__wide">Título<input name="title" value={title} onChange={(event) => handleTitleChange(event.target.value)} required /></label><label className="admin-form__wide">Slug<input name="slug" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Se genera desde el título, pero podés editarlo.</small></label><label>Fecha<input name="date" type="date" defaultValue={experience?.date} required /></label><label>Hora<input name="time" type="time" defaultValue={experience?.time} required /></label><label>Nombre del lugar<input name="venue_name" defaultValue={experience?.venueName} required /></label><label>Ubicación<input name="location" defaultValue={experience?.location} required /></label><label>Valor<input name="price" type="number" min="0" step="1" defaultValue={experience?.price ?? ""} /><small>Dejá vacío si es a consultar.</small></label><label>Categoría<input name="category" defaultValue={experience?.category} required /></label><label>Estado<select name="status" defaultValue={experience?.status ?? "available"}>{adminStatusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label><fieldset className="admin-image-field admin-form__wide"><legend>Imagen principal</legend><input type="hidden" name="remove_image" value={removeImage ? "true" : ""} /><input ref={inputRef} id="experience-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={handleImageChange} /><div className="admin-image-field__layout"><div className={`admin-image-preview${imagePreview ? "" : " admin-image-preview--empty"}`} style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : undefined} role="img" aria-label={imagePreview ? "Vista previa de la imagen principal" : "Sin imagen principal"}>{!imagePreview ? <span>Sin imagen propia</span> : null}</div><div className="admin-image-field__controls"><p>{imagePreview ? "Vista previa de la imagen principal." : "Elegí una imagen para esta experiencia."}</p>{imageName ? <small>{imageName}</small> : null}<div><label className="admin-action" htmlFor="experience-image">{imagePreview ? "Reemplazar imagen" : "Seleccionar archivo"}</label>{imagePreview ? <button className="admin-action admin-action--danger" type="button" onClick={handleRemoveImage}>Eliminar imagen</button> : null}</div><small>JPG, JPEG, PNG o WEBP. Máximo 5 MB.</small>{imageError ? <p className="admin-image-field__error" role="alert">{imageError}</p> : null}</div></div></fieldset><label className="admin-form__wide">Descripción breve<textarea name="short_description" defaultValue={experience?.shortDescription} rows={3} required /></label><label className="admin-form__wide">Descripción<textarea name="description" defaultValue={experience?.description} rows={6} required /></label><label className="admin-form__wide">Incluye<textarea name="includes" defaultValue={experience?.includes.join("\n")} rows={5} /><small>Un ítem por línea.</small></label></div><div className="admin-form__checks"><label><input name="featured" type="checkbox" defaultChecked={experience?.featured} /> Destacada</label><label><input name="published" type="checkbox" defaultChecked={experience?.published} /> Publicada</label></div><div className="admin-form__actions"><button className="admin-button admin-button--primary" type="submit">{submitLabel}</button></div></form>;
}
