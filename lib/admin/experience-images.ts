import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const EXPERIENCE_IMAGES_BUCKET = "experience-images";
export const MAX_EXPERIENCE_IMAGE_BYTES = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

type ImageUpload = {
  path: string;
  publicUrl: string;
};

type ImageInput = {
  file: File | null;
  error?: string;
};

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function sanitizedBaseName(fileName: string, extension: string) {
  const baseName = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;
  const normalized = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

  return normalized || "imagen";
}

function timestamp() {
  return new Date().toISOString().replace(/\D/g, "").slice(0, 14);
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value !== null && typeof value !== "string" && typeof value.arrayBuffer === "function";
}

function logImageDiagnostic(stage: string, file: File | null, error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[admin] Experience image ${stage}`, {
    file: file ? { name: file.name, extension: getExtension(file.name), type: file.type, size: file.size } : null,
    error,
  });
}

function imageValidationError(file: File, message: string) {
  logImageDiagnostic("validation failed", file, message);
  return message;
}

export function getExperienceImageInput(formData: FormData): ImageInput {
  const value = formData.get("image");
  if (value === null) return { file: null };

  if (!isFile(value)) {
    logImageDiagnostic("form data was invalid", null, "The image field was not a File.");
    return { file: null, error: "No pudimos leer el archivo seleccionado." };
  }

  if (value.name === "" && value.size === 0) return { file: null };

  if (value.size === 0) {
    logImageDiagnostic("form data contained an empty file", value, "The selected file has no content.");
    return { file: null, error: "El archivo está vacío. Elegí una imagen con contenido." };
  }

  return { file: value };
}

export function validateExperienceImage(file: File) {
  const extension = getExtension(file.name);

  if (!file.name.trim() || !Number.isFinite(file.size) || file.size < 0) {
    return imageValidationError(file, "No pudimos leer el archivo seleccionado.");
  }

  if (file.size === 0) {
    return imageValidationError(file, "El archivo está vacío. Elegí una imagen con contenido.");
  }

  if (!allowedExtensions.has(extension)) {
    return imageValidationError(file, "La extensión del archivo no es compatible. Usá JPG, JPEG, PNG o WEBP.");
  }

  if (!file.type) {
    return imageValidationError(file, "No pudimos identificar el formato del archivo. Elegí una imagen JPG, JPEG, PNG o WEBP.");
  }

  if (!allowedMimeTypes.has(file.type)) {
    return imageValidationError(file, "El formato de esta imagen no es compatible. Usá JPG, JPEG, PNG o WEBP.");
  }

  if (file.size > MAX_EXPERIENCE_IMAGE_BYTES) {
    return imageValidationError(file, "La imagen supera el tamaño permitido de 5 MB.");
  }

  return null;
}

function storageUploadErrorMessage(error: unknown) {
  const message = error instanceof Error
    ? error.message
    : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
      ? error.message
      : String(error);

  if (/file size|file_size|payload too large|too large|content length/i.test(message)) {
    return "Supabase rechazó la imagen porque supera el tamaño permitido de 5 MB.";
  }

  if (/mime|content type|file type|unsupported media|invalid type/i.test(message)) {
    return "Supabase rechazó la imagen porque el formato no está permitido.";
  }

  if (/row-level|permission|not authorized|unauthorized|access denied/i.test(message)) {
    return "Supabase rechazó la imagen porque no tenés permisos para subirla.";
  }

  return "Supabase rechazó la imagen. La experiencia quedó guardada y podés volver a intentarlo.";
}

export async function uploadExperienceImage(supabase: SupabaseClient, experienceId: string, file: File): Promise<{ data?: ImageUpload; error?: string }> {
  const validationError = validateExperienceImage(file);
  if (validationError) return { error: validationError };

  const extension = getExtension(file.name);
  const path = `${experienceId}/${timestamp()}-${randomUUID()}-${sanitizedBaseName(file.name, extension)}.${extension}`;
  let contents: ArrayBuffer;

  try {
    contents = await file.arrayBuffer();
  } catch (error) {
    logImageDiagnostic("could not read file", file, error);
    return { error: "No pudimos leer el archivo. Elegilo nuevamente e intentá otra vez." };
  }

  if (contents.byteLength === 0) {
    logImageDiagnostic("file was empty after reading", file, "The file ArrayBuffer has no content.");
    return { error: "El archivo está vacío. Elegí una imagen con contenido." };
  }

  let error: unknown;

  try {
    ({ error } = await supabase.storage.from(EXPERIENCE_IMAGES_BUCKET).upload(path, contents, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    }));
  } catch (uploadError) {
    logImageDiagnostic("request to Storage failed", file, uploadError);
    return { error: "No pudimos comunicarnos con el almacenamiento de imágenes. Intentá nuevamente." };
  }

  if (error) {
    logImageDiagnostic("Storage rejected upload", file, error);
    return { error: storageUploadErrorMessage(error) };
  }

  const { data } = supabase.storage.from(EXPERIENCE_IMAGES_BUCKET).getPublicUrl(path);
  return { data: { path, publicUrl: data.publicUrl } };
}

function getManagedStoragePath(imageUrl: string | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!imageUrl || !supabaseUrl) return null;

  try {
    const image = new URL(imageUrl);
    const project = new URL(supabaseUrl);
    const prefix = `/storage/v1/object/public/${EXPERIENCE_IMAGES_BUCKET}/`;

    if (image.origin !== project.origin || !image.pathname.startsWith(prefix)) return null;

    const path = decodeURIComponent(image.pathname.slice(prefix.length));
    return path || null;
  } catch {
    return null;
  }
}

export async function removeExperienceImage(supabase: SupabaseClient, imageUrl: string | null) {
  const path = getManagedStoragePath(imageUrl);
  if (!path) return null;

  const { error } = await supabase.storage.from(EXPERIENCE_IMAGES_BUCKET).remove([path]);
  if (error) {
    console.error("[admin] Could not remove experience image", error);
    return "No se pudo eliminar el archivo anterior de Storage.";
  }

  return null;
}

export async function removeExperienceImageByPath(supabase: SupabaseClient, path: string) {
  const { error } = await supabase.storage.from(EXPERIENCE_IMAGES_BUCKET).remove([path]);
  if (error) console.error("[admin] Could not clean up uploaded experience image", error);
}
