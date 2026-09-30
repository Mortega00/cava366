import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto", description: "Escribile a CAVA366 para consultar por catas, experiencias y vinos." };

export default function ContactPage() {
  return <main className="contact-page section section--cream"><div className="shell contact-page__grid"><div><p className="eyebrow">Contacto</p><h1>Hablemos de<br />la próxima copa.</h1><p>¿Querés consultar por una fecha, una experiencia o un vino? Escribinos por el canal que te resulte más cómodo.</p></div><div className="contact-options"><a href="https://wa.me/" target="_blank" rel="noreferrer"><span>01</span><div><p>WhatsApp</p><strong>Escribir por WhatsApp</strong></div><b aria-hidden="true">↗</b></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span>02</span><div><p>Instagram</p><strong>Seguir y escribir por Instagram</strong></div><b aria-hidden="true">↗</b></a><div className="contact-note">Los enlaces son placeholders y deben reemplazarse por los perfiles oficiales de CAVA366 antes de publicar.</div></div></div></main>;
}
