"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { formatProductPrice } from "@/lib/product-format";
import type { AdminProduct } from "@/lib/admin/product-types";

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: AdminProduct;
  submitLabel: string;
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getPricePreview(value: string) {
  const price = value === "" ? null : Number(value);
  return price !== null && Number.isInteger(price) && price >= 0 ? formatProductPrice(price) : null;
}

export function ProductForm({ action, product, submitLabel }: ProductFormProps) {
  const initialName = product?.name ?? "";
  const initialSlug = product?.slug ?? "";
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [slugEdited, setSlugEdited] = useState(Boolean(product) && initialSlug !== slugify(initialName));
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [offerPrice, setOfferPrice] = useState(product?.offerPrice?.toString() ?? "");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  const pricePreview = getPricePreview(price);
  const offerPricePreview = getPricePreview(offerPrice);

  return <form action={action} className="admin-form admin-product-form"><div className="admin-form__grid"><label className="admin-form__wide">Nombre<input name="name" value={name} onChange={(event) => handleNameChange(event.target.value)} required /></label><label className="admin-form__wide">Slug<input name="slug" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Se genera desde el nombre, pero podés editarlo.</small></label><label>Bodega<input name="winery" defaultValue={product?.winery} /></label><label>Varietal / tipo de uva<input name="varietal" defaultValue={product?.varietal} /></label><label className="admin-form__wide">Origen<input name="origin" defaultValue={product?.origin} /></label><label>Precio normal<input name="price" type="number" min="0" step="1" value={price} onChange={(event) => setPrice(event.target.value)} /><small>{pricePreview ? `Vista previa: ${pricePreview}` : "Dejá vacío si es a consultar."}</small></label><label>Precio de oferta<input name="offer_price" type="number" min="0" step="1" value={offerPrice} onChange={(event) => setOfferPrice(event.target.value)} /><small>{offerPricePreview ? `Vista previa: Oferta ${offerPricePreview}` : "Dejá vacío si no hay precio promocional."}</small></label><label>Stock<input name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? ""} /><small>Dejá vacío si no querés informarlo todavía.</small></label><label className="admin-form__wide">Etiqueta de oferta<input name="offer_label" defaultValue={product?.offerLabel} /><small>Texto comercial opcional para una oferta activa.</small></label><ImageUploadField inputId="product-image" imageUrl={product?.imageUrl} subject="este vino" /><label className="admin-form__wide">Descripción<textarea name="description" defaultValue={product?.description} rows={6} /></label></div><div className="admin-form__checks"><label><input name="featured" type="checkbox" defaultChecked={product?.featured} /> Destacada</label><label><input name="published" type="checkbox" defaultChecked={product?.published} /> Publicada</label><label><input name="is_offer" type="checkbox" defaultChecked={product?.isOffer} /> En oferta</label></div><div className="admin-form__actions"><button className="admin-button admin-button--primary" type="submit">{submitLabel}</button></div></form>;
}
