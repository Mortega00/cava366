"use client";

import { useEffect, useRef, useState } from "react";
import { getImageExtension, validateImageFile } from "@/lib/admin/image-validation";

type ImageUploadFieldProps = {
  inputId: string;
  imageUrl?: string | null;
  subject: string;
};

function logClientImageValidation(file: File, error: string) {
  if (process.env.NODE_ENV !== "development") return;

  console.error("[admin] Image client validation failed", {
    file: { name: file.name, extension: getImageExtension(file.name), type: file.type, size: file.size },
    error,
  });
}

export function ImageUploadField({ inputId, imageUrl = null, subject }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
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
    setRemoveImage(Boolean(imageUrl));
    if (inputRef.current) inputRef.current.value = "";
  }

  return <fieldset className="admin-image-field admin-form__wide"><legend>Imagen principal</legend><input type="hidden" name="remove_image" value={removeImage ? "true" : ""} /><input ref={inputRef} id={inputId} name="image" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={handleImageChange} /><div className="admin-image-field__layout"><div className={`admin-image-preview${imagePreview ? "" : " admin-image-preview--empty"}`} style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : undefined} role="img" aria-label={imagePreview ? "Vista previa de la imagen principal" : "Sin imagen principal"}>{!imagePreview ? <span>Sin imagen propia</span> : null}</div><div className="admin-image-field__controls"><p>{imagePreview ? "Vista previa de la imagen principal." : `Elegí una imagen para ${subject}.`}</p>{imageName ? <small>{imageName}</small> : null}<div><label className="admin-action" htmlFor={inputId}>{imagePreview ? "Reemplazar imagen" : "Seleccionar archivo"}</label>{imagePreview ? <button className="admin-action admin-action--danger" type="button" onClick={handleRemoveImage}>Eliminar imagen</button> : null}</div><small>JPG, JPEG, PNG o WEBP. Máximo 5 MB.</small>{imageError ? <p className="admin-image-field__error" role="alert">{imageError}</p> : null}</div></div></fieldset>;
}
