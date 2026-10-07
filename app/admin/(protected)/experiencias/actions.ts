"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getExperienceImageInput, removeExperienceImage, removeExperienceImageByPath, uploadExperienceImage, validateExperienceImage } from "@/lib/admin/experience-images";
import type { ExperienceStatus } from "@/types/experience";

type ExperienceInput = {
  title: string;
  slug: string;
  date: string;
  time: string;
  venue_name: string;
  location: string;
  price: number | null;
  category: string;
  short_description: string;
  description: string;
  includes: string[];
  featured: boolean;
  published: boolean;
  status: ExperienceStatus;
};

const validStatuses = new Set<ExperienceStatus>(["available", "last_spots", "sold_out", "finished"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toText(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function parseExperience(formData: FormData): { value?: ExperienceInput; error?: string } {
  const title = toText(formData, "title");
  const slug = toText(formData, "slug");
  const date = toText(formData, "date");
  const time = toText(formData, "time");
  const venueName = toText(formData, "venue_name");
  const location = toText(formData, "location");
  const category = toText(formData, "category");
  const shortDescription = toText(formData, "short_description");
  const description = toText(formData, "description");
  const status = toText(formData, "status") as ExperienceStatus;
  const rawPrice = toText(formData, "price");

  if (![title, slug, date, time, venueName, location, category, shortDescription, description].every(Boolean)) {
    return { error: "Completá todos los campos obligatorios." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "El slug debe usar minúsculas, números y guiones." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return { error: "Ingresá una fecha y hora válidas." };
  }

  const price = rawPrice === "" ? null : Number(rawPrice);
  if (price !== null && (!Number.isInteger(price) || price < 0)) {
    return { error: "El valor debe ser un número entero igual o mayor que cero." };
  }

  if (!validStatuses.has(status)) {
    return { error: "Seleccioná un estado válido." };
  }

  return {
    value: {
      title,
      slug,
      date,
      time,
      venue_name: venueName,
      location,
      price,
      category,
      short_description: shortDescription,
      description,
      includes: toText(formData, "includes").split("\n").map((item) => item.trim()).filter(Boolean),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      status,
    },
  };
}

function noticePath(path: string, key: "error" | "success", message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

function revalidateExperienceViews() {
  revalidatePath("/");
  revalidatePath("/experiencias");
  revalidatePath("/calendario");
  revalidatePath("/admin");
  revalidatePath("/admin/experiencias");
}

export async function createExperience(formData: FormData) {
  const parsed = parseExperience(formData);
  if (!parsed.value) {
    redirect(noticePath("/admin/experiencias/nueva", "error", parsed.error ?? "No se pudo guardar la experiencia."));
  }

  const imageInput = getExperienceImageInput(formData);
  if (imageInput.error) {
    redirect(noticePath("/admin/experiencias/nueva", "error", imageInput.error));
  }

  const imageFile = imageInput.file;
  const imageError = imageFile ? validateExperienceImage(imageFile) : null;
  if (imageError) {
    redirect(noticePath("/admin/experiencias/nueva", "error", imageError));
  }

  const { supabase } = await requireAdminUser();
  const { data: createdExperience, error } = await supabase
    .from("experiences")
    .insert({ ...parsed.value, image_url: null })
    .select("id")
    .single();

  if (error || !createdExperience) {
    console.error("[admin] Could not create experience", error);
    redirect(noticePath("/admin/experiencias/nueva", "error", "No se pudo guardar la experiencia. Revisá el slug e intentá nuevamente."));
  }

  const editorPath = `/admin/experiencias/${createdExperience.id}/editar`;
  if (imageFile) {
    const upload = await uploadExperienceImage(supabase, createdExperience.id, imageFile);
    if (!upload.data) {
      revalidateExperienceViews();
      redirect(noticePath(editorPath, "error", upload.error ?? "La experiencia se guardó, pero no se pudo subir la imagen."));
    }

    const { error: imageUrlError } = await supabase
      .from("experiences")
      .update({ image_url: upload.data.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", createdExperience.id);

    if (imageUrlError) {
      await removeExperienceImageByPath(supabase, upload.data.path);
      console.error("[admin] Could not save experience image URL", imageUrlError);
      revalidateExperienceViews();
      redirect(noticePath(editorPath, "error", "La experiencia se guardó, pero no se pudo asociar la imagen."));
    }
  }

  revalidateExperienceViews();
  redirect(noticePath("/admin/experiencias", "success", "Experiencia creada correctamente."));
}

export async function updateExperience(id: string, formData: FormData) {
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/experiencias", "error", "La experiencia indicada no es válida."));
  }

  const parsed = parseExperience(formData);
  const editorPath = `/admin/experiencias/${id}/editar`;
  if (!parsed.value) {
    redirect(noticePath(editorPath, "error", parsed.error ?? "No se pudo guardar la experiencia."));
  }

  const imageInput = getExperienceImageInput(formData);
  if (imageInput.error) {
    redirect(noticePath(editorPath, "error", imageInput.error));
  }

  const imageFile = imageInput.file;
  const imageError = imageFile ? validateExperienceImage(imageFile) : null;
  if (imageError) {
    redirect(noticePath(editorPath, "error", imageError));
  }

  const { supabase } = await requireAdminUser();
  const { data: currentExperience, error: currentError } = await supabase
    .from("experiences")
    .select("image_url")
    .eq("id", id)
    .single();

  if (currentError || !currentExperience) {
    console.error("[admin] Could not load current experience image", currentError);
    redirect(noticePath(editorPath, "error", "No se pudo cargar la experiencia para actualizarla."));
  }

  const updateValues = { ...parsed.value, updated_at: new Date().toISOString() };

  if (imageFile) {
    const upload = await uploadExperienceImage(supabase, id, imageFile);
    if (!upload.data) {
      redirect(noticePath(editorPath, "error", upload.error ?? "No se pudo subir la nueva imagen."));
    }

    const { error } = await supabase
      .from("experiences")
      .update({ ...updateValues, image_url: upload.data.publicUrl })
      .eq("id", id);

    if (error) {
      await removeExperienceImageByPath(supabase, upload.data.path);
      console.error("[admin] Could not save replacement image URL", error);
      redirect(noticePath(editorPath, "error", "No se pudo actualizar la experiencia. La imagen nueva no se guardó."));
    }

    const removalError = await removeExperienceImage(supabase, currentExperience.image_url);
    revalidateExperienceViews();
    if (removalError) {
      redirect(noticePath(editorPath, "error", `Cambios guardados, pero ${removalError.toLowerCase()}`));
    }

    redirect(noticePath(editorPath, "success", "Cambios e imagen guardados correctamente."));
  }

  if (toText(formData, "remove_image") === "true") {
    const { error } = await supabase
      .from("experiences")
      .update({ ...updateValues, image_url: null })
      .eq("id", id);

    if (error) {
      console.error("[admin] Could not remove experience image URL", error);
      redirect(noticePath(editorPath, "error", "No se pudo quitar la imagen de la experiencia."));
    }

    const removalError = await removeExperienceImage(supabase, currentExperience.image_url);
    revalidateExperienceViews();
    if (removalError) {
      redirect(noticePath(editorPath, "error", `Cambios guardados, pero ${removalError.toLowerCase()}`));
    }

    redirect(noticePath(editorPath, "success", "Imagen eliminada y cambios guardados correctamente."));
  }

  const { error } = await supabase.from("experiences").update(updateValues).eq("id", id);
  if (error) {
    console.error("[admin] Could not update experience", error);
    redirect(noticePath(editorPath, "error", "No se pudo actualizar la experiencia. Revisá el slug e intentá nuevamente."));
  }

  revalidateExperienceViews();
  redirect(noticePath(editorPath, "success", "Cambios guardados correctamente."));
}

export async function togglePublished(formData: FormData) {
  const id = toText(formData, "id");
  const published = toText(formData, "published") === "true";
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/experiencias", "error", "La experiencia indicada no es válida."));
  }

  const { supabase } = await requireAdminUser();
  const { error } = await supabase.from("experiences").update({ published, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    console.error("[admin] Could not change publication state", error);
    redirect(noticePath("/admin/experiencias", "error", "No se pudo cambiar el estado de publicación."));
  }

  revalidateExperienceViews();
  redirect(noticePath("/admin/experiencias", "success", published ? "Experiencia publicada." : "Experiencia despublicada."));
}

export async function deleteExperience(formData: FormData) {
  const id = toText(formData, "id");
  if (!uuidPattern.test(id)) {
    redirect(noticePath("/admin/experiencias", "error", "La experiencia indicada no es válida."));
  }

  const { supabase } = await requireAdminUser();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    console.error("[admin] Could not delete experience", error);
    redirect(noticePath("/admin/experiencias", "error", "No se pudo eliminar la experiencia."));
  }

  revalidateExperienceViews();
  redirect(noticePath("/admin/experiencias", "success", "Experiencia eliminada."));
}
