"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getProductImageInput, removeProductImage, removeProductImageByPath, uploadProductImage, validateProductImage } from "@/lib/admin/product-images";

type ProductInput = {
  name: string;
  slug: string;
  winery: string | null;
  varietal: string | null;
  origin: string | null;
  description: string | null;
  price: number | null;
  offer_price: number | null;
  stock: number | null;
  featured: boolean;
  published: boolean;
  is_offer: boolean;
  offer_label: string | null;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toText(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function toNullableText(formData: FormData, field: string) {
  return toText(formData, field) || null;
}

function parseNullableInteger(rawValue: string, label: string): { value?: number | null; error?: string } {
  if (rawValue === "") return { value: null };

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 0) {
    return { error: `${label} debe ser un número entero igual o mayor que cero.` };
  }

  return { value };
}

function parseProduct(formData: FormData): { value?: ProductInput; error?: string } {
  const name = toText(formData, "name");
  const slug = toText(formData, "slug");

  if (!name || !slug) return { error: "Completá el nombre y el slug." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "El slug debe usar minúsculas, números y guiones." };
  }

  const price = parseNullableInteger(toText(formData, "price"), "El precio");
  if (price.error) return { error: price.error };

  const offerPrice = parseNullableInteger(toText(formData, "offer_price"), "El precio de oferta");
  if (offerPrice.error) return { error: offerPrice.error };

  const stock = parseNullableInteger(toText(formData, "stock"), "El stock");
  if (stock.error) return { error: stock.error };

  const isOffer = formData.get("is_offer") === "on";
  const normalPrice = price.value ?? null;
  const promotionalPrice = offerPrice.value ?? null;

  if (isOffer && promotionalPrice !== null) {
    if (normalPrice === null) {
      return { error: "El precio de oferta requiere un precio normal." };
    }

    if (promotionalPrice >= normalPrice) {
      return { error: "El precio de oferta debe ser menor que el precio normal." };
    }
  }

  return {
    value: {
      name,
      slug,
      winery: toNullableText(formData, "winery"),
      varietal: toNullableText(formData, "varietal"),
      origin: toNullableText(formData, "origin"),
      description: toNullableText(formData, "description"),
      price: normalPrice,
      offer_price: isOffer ? promotionalPrice : null,
      stock: stock.value ?? null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      is_offer: isOffer,
      offer_label: isOffer ? toNullableText(formData, "offer_label") : null,
    },
  };
}

function noticePath(path: string, key: "error" | "success", message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

function revalidateProductViews() {
  revalidatePath("/vinos");
  revalidatePath("/admin");
  revalidatePath("/admin/vinos");
}

export async function createProduct(formData: FormData) {
  const parsed = parseProduct(formData);
  if (!parsed.value) {
    redirect(noticePath("/admin/vinos/nuevo", "error", parsed.error ?? "No se pudo guardar el vino."));
  }

  const imageInput = getProductImageInput(formData);
  if (imageInput.error) {
    redirect(noticePath("/admin/vinos/nuevo", "error", imageInput.error));
  }

  const imageFile = imageInput.file;
  const imageError = imageFile ? validateProductImage(imageFile) : null;
  if (imageError) {
    redirect(noticePath("/admin/vinos/nuevo", "error", imageError));
  }

  const { supabase } = await requireAdminUser();
  const { data: createdProduct, error } = await supabase
    .from("products")
    .insert({ ...parsed.value, image_url: null })
    .select("id")
    .single();

  if (error || !createdProduct) {
    console.error("[admin] Could not create product", error);
    redirect(noticePath("/admin/vinos/nuevo", "error", "No se pudo guardar el vino. Revisá el slug e intentá nuevamente."));
  }

  const editorPath = `/admin/vinos/${createdProduct.id}/editar`;
  if (imageFile) {
    const upload = await uploadProductImage(supabase, createdProduct.id, imageFile);
    if (!upload.data) {
      revalidateProductViews();
      redirect(noticePath(editorPath, "error", upload.error ?? "El vino se guardó, pero no se pudo subir la imagen."));
    }

    const { error: imageUrlError } = await supabase
      .from("products")
      .update({ image_url: upload.data.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", createdProduct.id);

    if (imageUrlError) {
      await removeProductImageByPath(supabase, upload.data.path);
      console.error("[admin] Could not save product image URL", imageUrlError);
      revalidateProductViews();
      redirect(noticePath(editorPath, "error", "El vino se guardó, pero no se pudo asociar la imagen."));
    }
  }

  revalidateProductViews();
  redirect(noticePath("/admin/vinos", "success", "Vino creado correctamente."));
}

export async function updateProduct(id: string, formData: FormData) {
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/vinos", "error", "El vino indicado no es válido."));
  }

  const parsed = parseProduct(formData);
  const editorPath = `/admin/vinos/${id}/editar`;
  if (!parsed.value) {
    redirect(noticePath(editorPath, "error", parsed.error ?? "No se pudo guardar el vino."));
  }

  const imageInput = getProductImageInput(formData);
  if (imageInput.error) {
    redirect(noticePath(editorPath, "error", imageInput.error));
  }

  const imageFile = imageInput.file;
  const imageError = imageFile ? validateProductImage(imageFile) : null;
  if (imageError) {
    redirect(noticePath(editorPath, "error", imageError));
  }

  const { supabase } = await requireAdminUser();
  const { data: currentProduct, error: currentError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  if (currentError || !currentProduct) {
    console.error("[admin] Could not load current product image", currentError);
    redirect(noticePath(editorPath, "error", "No se pudo cargar el vino para actualizarlo."));
  }

  const updateValues = { ...parsed.value, updated_at: new Date().toISOString() };

  if (imageFile) {
    const upload = await uploadProductImage(supabase, id, imageFile);
    if (!upload.data) {
      redirect(noticePath(editorPath, "error", upload.error ?? "No se pudo subir la nueva imagen."));
    }

    const { error } = await supabase
      .from("products")
      .update({ ...updateValues, image_url: upload.data.publicUrl })
      .eq("id", id);

    if (error) {
      await removeProductImageByPath(supabase, upload.data.path);
      console.error("[admin] Could not save replacement product image URL", error);
      redirect(noticePath(editorPath, "error", "No se pudo actualizar el vino. La imagen nueva no se guardó."));
    }

    const removalError = await removeProductImage(supabase, currentProduct.image_url);
    revalidateProductViews();
    if (removalError) {
      redirect(noticePath(editorPath, "error", `Cambios guardados, pero ${removalError.toLowerCase()}`));
    }

    redirect(noticePath(editorPath, "success", "Cambios e imagen guardados correctamente."));
  }

  if (toText(formData, "remove_image") === "true") {
    const { error } = await supabase
      .from("products")
      .update({ ...updateValues, image_url: null })
      .eq("id", id);

    if (error) {
      console.error("[admin] Could not remove product image URL", error);
      redirect(noticePath(editorPath, "error", "No se pudo quitar la imagen del vino."));
    }

    const removalError = await removeProductImage(supabase, currentProduct.image_url);
    revalidateProductViews();
    if (removalError) {
      redirect(noticePath(editorPath, "error", `Cambios guardados, pero ${removalError.toLowerCase()}`));
    }

    redirect(noticePath(editorPath, "success", "Imagen eliminada y cambios guardados correctamente."));
  }

  const { error } = await supabase.from("products").update(updateValues).eq("id", id);
  if (error) {
    console.error("[admin] Could not update product", error);
    redirect(noticePath(editorPath, "error", "No se pudo actualizar el vino. Revisá el slug e intentá nuevamente."));
  }

  revalidateProductViews();
  redirect(noticePath(editorPath, "success", "Cambios guardados correctamente."));
}

export async function toggleProductPublished(formData: FormData) {
  const id = toText(formData, "id");
  const published = toText(formData, "published") === "true";
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/vinos", "error", "El vino indicado no es válido."));
  }

  const { supabase } = await requireAdminUser();
  const { error } = await supabase.from("products").update({ published, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    console.error("[admin] Could not change product publication state", error);
    redirect(noticePath("/admin/vinos", "error", "No se pudo cambiar el estado de publicación."));
  }

  revalidateProductViews();
  redirect(noticePath("/admin/vinos", "success", published ? "Vino publicado." : "Vino despublicado."));
}

export async function deleteProduct(formData: FormData) {
  const id = toText(formData, "id");
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/vinos", "error", "El vino indicado no es válido."));
  }

  const { supabase } = await requireAdminUser();
  const { data: product, error: productError } = await supabase.from("products").select("image_url").eq("id", id).maybeSingle();
  if (productError || !product) {
    console.error("[admin] Could not load product before deletion", productError);
    redirect(noticePath("/admin/vinos", "error", "No se pudo cargar el vino para eliminarlo."));
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("[admin] Could not delete product", error);
    redirect(noticePath("/admin/vinos", "error", "No se pudo eliminar el vino."));
  }

  const removalError = await removeProductImage(supabase, product.image_url);
  revalidateProductViews();
  if (removalError) {
    redirect(noticePath("/admin/vinos", "error", `Vino eliminado, pero ${removalError.toLowerCase()}`));
  }

  redirect(noticePath("/admin/vinos", "success", "Vino eliminado correctamente."));
}
