import type { SupabaseClient } from "@supabase/supabase-js";
import { MAX_IMAGE_BYTES, getImageInput, removeManagedImage, removeManagedImageByPath, uploadManagedImage, validateManagedImage } from "@/lib/admin/image-storage";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const MAX_PRODUCT_IMAGE_BYTES = MAX_IMAGE_BYTES;

export function getProductImageInput(formData: FormData) {
  return getImageInput(formData, "Product");
}

export function validateProductImage(file: File) {
  return validateManagedImage(file, "Product");
}

export async function uploadProductImage(supabase: SupabaseClient, productId: string, file: File) {
  return uploadManagedImage(supabase, {
    bucket: PRODUCT_IMAGES_BUCKET,
    entityId: productId,
    file,
    logLabel: "Product",
    savedEntityMessage: "El vino quedó guardado y podés volver a intentarlo.",
  });
}

export async function removeProductImage(supabase: SupabaseClient, imageUrl: string | null) {
  return removeManagedImage(supabase, PRODUCT_IMAGES_BUCKET, imageUrl, "product");
}

export async function removeProductImageByPath(supabase: SupabaseClient, path: string) {
  return removeManagedImageByPath(supabase, PRODUCT_IMAGES_BUCKET, path, "product");
}
