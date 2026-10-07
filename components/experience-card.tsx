import Image from "next/image";
import Link from "next/link";
import { canReserveExperience, formatExperienceDate, getExperienceAvailabilityLabel, getExperienceWhatsAppReservationUrl } from "@/lib/experiences";
import type { Experience } from "@/types/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const className = experience.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const availabilityLabel = getExperienceAvailabilityLabel(experience);
  const canReserve = canReserveExperience(experience);
  const reservationUrl = canReserve ? getExperienceWhatsAppReservationUrl(experience) : null;

  return <article className={`experience-card experience-card--${className}`}>
    <div className={`experience-card__art${experience.imageUrl ? " experience-card__art--image" : ""}`} aria-hidden="true">{experience.imageUrl ? <Image src={experience.imageUrl} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" className="experience-card__image" /> : <><span className="experience-card__shape" /><span className="experience-card__line" /></>}<p>{experience.category}</p></div>
    <div className="experience-card__body"><p className="experience-card__date">{formatExperienceDate(experience.date, { day: "2-digit", month: "short" })} · {experience.time} h</p><h3>{experience.title}</h3><p className="experience-card__location">{experience.locationLabel}</p><p className="experience-card__copy">{experience.shortDescription}</p>{availabilityLabel ? <p className={`experience-card__availability experience-card__availability--${experience.status}`}>{availabilityLabel}</p> : null}<div className="experience-card__bottom"><span>{experience.price}</span><div className="experience-card__actions">{reservationUrl ? <a href={reservationUrl} target="_blank" rel="noreferrer" aria-label={`Reservar lugar para ${experience.title} por WhatsApp`}>Reservar lugar <b aria-hidden="true">↗</b></a> : null}<Link href={`/experiencias/${experience.slug}`} aria-label={`Ver ${experience.title}`}>Ver experiencia <b aria-hidden="true">→</b></Link></div></div></div>
  </article>;
}
