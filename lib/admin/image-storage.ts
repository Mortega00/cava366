import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getImageExtension, validateImageFile } from "@/lib/admin/image-validation";

export { MAX_IMAGE_BYTES } from "@/lib/admin/image-validation";

export type ImageInput = {
  file: File | null;
  error?: string;
};

export type ImageUpload = {
  path: string;
  publicUrl: string;
};

type ImageStorageOptions = {
  bucket: string;
  entityId: string;
  file: File;
  logLabel: string;
  savedEntityMessage: string;
};

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

function logImageDiagnostic(logLabel: string, stage: string, file: File | null, error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  console.error(`[admin] ${logLabel} image ${stage}`, {
    file: file ? { name: file.name, extension: getImageExtension(file.name), type: file.type, size: file.size } : null,
    error,
  });
}

export function getImageInput(formData: FormData, logLabel: string): ImageInput {
  const value = formData.get("image");
  if (value === null) return { file: null };

  if (!isFile(value)) {
    logImageDiagnostic(logLabel, "form data was invalid", null, "The image field was not a File.");
    return { file: null, error: "No pudimos leer el archivo seleccionado." };
  }

  if (value.name === "" && value.size === 0) return { file: null };

  if (value.size === 0) {
    logImageDiagnostic(logLabel, "form data contained an empty file", value, "The selected file has no content.");
    return { file: null, error: "El archivo está vacío. Elegí una imagen con contenido." };
  }

  return { file: value };
}

export function validateManagedImage(file: File, logLabel: string) {
  const error = validateImageFile(file);
  if (error) logImageDiagnostic(logLabel, "validation failed", file, error);
  return error;
}

function storageUploadErrorMessage(error: unknown, savedEntityMessage: string) {
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

  return `Supabase rechazó la imagen. ${savedEntityMessage}`;
}

export async function uploadManagedImage(supabase: SupabaseClient, options: ImageStorageOptions): Promise<{ data?: ImageUpload; error?: string }> {
  const { bucket, entityId, file, logLabel, savedEntityMessage } = options;
  const validationError = validateManagedImage(file, logLabel);
  if (validationError) return { error: validationError };

  const extension = getImageExtension(file.name);
  const path = `${entityId}/${timestamp()}-${randomUUID()}-${sanitizedBaseName(file.name, extension)}.${extension}`;
  let contents: ArrayBuffer;

  try {
    contents = await file.arrayBuffer();
  } catch (error) {
    logImageDiagnostic(logLabel, "could not read file", file, error);
    return { error: "No pudimos leer el archivo. Elegilo nuevamente e intentá otra vez." };
  }

  if (contents.byteLength === 0) {
    logImageDiagnostic(logLabel, "file was empty after reading", file, "The file ArrayBuffer has no content.");
    return { error: "El archivo está vacío. Elegí una imagen con contenido." };
  }

  let error: unknown;

  try {
    ({ error } = await supabase.storage.from(bucket).upload(path, contents, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    }));
  } catch (uploadError) {
    logImageDiagnostic(logLabel, "request to Storage failed", file, uploadError);
    return { error: "No pudimos comunicarnos con el almacenamiento de imágenes. Intentá nuevamente." };
  }

  if (error) {
    logImageDiagnostic(logLabel, "Storage rejected upload", file, error);
    return { error: storageUploadErrorMessage(error, savedEntityMessage) };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { data: { path, publicUrl: data.publicUrl } };
}

function getManagedStoragePath(bucket: string, imageUrl: string | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!imageUrl || !supabaseUrl) return null;

  try {
    const image = new URL(imageUrl);
    const project = new URL(supabaseUrl);
    const prefix = `/storage/v1/object/public/${bucket}/`;

    if (image.origin !== project.origin || !image.pathname.startsWith(prefix)) return null;

    const path = decodeURIComponent(image.pathname.slice(prefix.length));
    return path || null;
  } catch {
    return null;
  }
}

export async function removeManagedImage(supabase: SupabaseClient, bucket: string, imageUrl: string | null, logLabel: string) {
  const path = getManagedStoragePath(bucket, imageUrl);
  if (!path) return null;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`[admin] Could not remove ${logLabel} image`, error);
    return "No se pudo eliminar el archivo anterior de Storage.";
  }

  return null;
}

export async function removeManagedImageByPath(supabase: SupabaseClient, bucket: string, path: string, logLabel: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error(`[admin] Could not clean up uploaded ${logLabel} image`, error);
}
