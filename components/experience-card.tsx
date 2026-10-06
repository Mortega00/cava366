import Link from "next/link";
import { formatExperienceDate } from "@/lib/experiences";
import type { Experience } from "@/types/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const className = experience.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return <article className={`experience-card experience-card--${className}`}>
    <div className="experience-card__art" aria-hidden="true"><span className="experience-card__shape" /><span className="experience-card__line" /><p>{experience.category}</p></div>
    <div className="experience-card__body"><p className="experience-card__date">{formatExperienceDate(experience.date, { day: "2-digit", month: "short" })} · {experience.time} h</p><h3>{experience.title}</h3><p className="experience-card__location">{experience.locationLabel}</p><p className="experience-card__copy">{experience.shortDescription}</p><div className="experience-card__bottom"><span>{experience.price}</span><Link href={`/experiencias/${experience.slug}`} aria-label={`Ver ${experience.title}`}>Ver experiencia <b aria-hidden="true">→</b></Link></div></div>
  </article>;
}
