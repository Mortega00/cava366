import type { SupabaseClient } from "@supabase/supabase-js";
import { MAX_IMAGE_BYTES, getImageInput, removeManagedImage, removeManagedImageByPath, uploadManagedImage, validateManagedImage } from "@/lib/admin/image-storage";

export const EXPERIENCE_IMAGES_BUCKET = "experience-images";
export const MAX_EXPERIENCE_IMAGE_BYTES = MAX_IMAGE_BYTES;

export function getExperienceImageInput(formData: FormData) {
  return getImageInput(formData, "Experience");
}

export function validateExperienceImage(file: File) {
  return validateManagedImage(file, "Experience");
}

export async function uploadExperienceImage(supabase: SupabaseClient, experienceId: string, file: File) {
  return uploadManagedImage(supabase, {
    bucket: EXPERIENCE_IMAGES_BUCKET,
    entityId: experienceId,
    file,
    logLabel: "Experience",
    savedEntityMessage: "La experiencia quedó guardada y podés volver a intentarlo.",
  });
}

export async function removeExperienceImage(supabase: SupabaseClient, imageUrl: string | null) {
  return removeManagedImage(supabase, EXPERIENCE_IMAGES_BUCKET, imageUrl, "experience");
}

export async function removeExperienceImageByPath(supabase: SupabaseClient, path: string) {
  return removeManagedImageByPath(supabase, EXPERIENCE_IMAGES_BUCKET, path, "experience");
}
