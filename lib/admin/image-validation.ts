export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export function getImageExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function validateImageFile(file: File) {
  const extension = getImageExtension(file.name);

  if (!file.name.trim() || !Number.isFinite(file.size) || file.size < 0) {
    return "No pudimos leer el archivo seleccionado.";
  }

  if (file.size === 0) {
    return "El archivo está vacío. Elegí una imagen con contenido.";
  }

  if (!allowedExtensions.has(extension)) {
    return "La extensión del archivo no es compatible. Usá JPG, JPEG, PNG o WEBP.";
  }

  if (!file.type) {
    return "No pudimos identificar el formato del archivo. Elegí una imagen JPG, JPEG, PNG o WEBP.";
  }

  if (!allowedMimeTypes.has(file.type)) {
    return "El formato de esta imagen no es compatible. Usá JPG, JPEG, PNG o WEBP.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen supera el tamaño permitido de 5 MB.";
  }

  return null;
}
