import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experiences, formatExperienceDate, getExperienceBySlug } from "@/data/experiences";

type Props = PageProps<"/experiencias/[slug]">;
export function generateStaticParams() { return experiences.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const experience = getExperienceBySlug(slug); return experience ? { title: experience.title, description: experience.shortDescription } : {}; }

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params; const experience = getExperienceBySlug(slug); if (!experience) notFound();
  return <main><section className="experience-detail-hero"><Image src={experience.image} alt={experience.imageAlt} fill priority sizes="100vw" className="experience-detail-hero__image" /><div className="experience-detail-hero__overlay" /><div className="shell experience-detail-hero__content"><Link className="back-link" href="/experiencias">← Experiencias</Link><p className="eyebrow eyebrow--light">{experience.category}</p><h1>{experience.title}</h1><p>{experience.shortDescription}</p></div></section><section className="section section--cream experience-detail"><div className="shell experience-detail__grid"><div className="experience-detail__main"><p className="eyebrow">El encuentro</p><h2>Una excusa para bajar el ritmo.</h2><p>{experience.description}</p><p>La información de esta experiencia es de muestra y se actualizará con la propuesta final antes de publicar la agenda.</p><div className="video-placeholder" role="img" aria-label="Espacio reservado para video de la experiencia"><span>Video del encuentro</span><b aria-hidden="true">▶</b></div></div><aside className="experience-detail__aside"><dl><div><dt>Fecha</dt><dd>{formatExperienceDate(experience.date)}</dd></div><div><dt>Hora</dt><dd>{experience.time} h</dd></div><div><dt>Lugar</dt><dd>{experience.location}</dd></div><div><dt>Valor</dt><dd>{experience.price}</dd></div></dl><div className="includes"><h3>¿Qué incluye?</h3><ul>{experience.includes.map((item) => <li key={item}>{item}</li>)}</ul></div><Link className="button button--dark button--full" href="/contacto">Consultar por esta fecha <span aria-hidden="true">↗</span></Link></aside></div></section></main>;
}
