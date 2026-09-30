import type { Metadata } from "next";
import Link from "next/link";
import { formatExperienceDate, groupExperiencesByMonth } from "@/data/experiences";

export const metadata: Metadata = { title: "Calendario", description: "Agenda de próximas catas y experiencias de CAVA366." };

export default function CalendarPage() {
  const groups = groupExperiencesByMonth();
  return <main className="section section--cream calendar-page"><div className="shell"><div className="calendar-heading"><p className="eyebrow">Calendario</p><h1>Una agenda para<br />ir marcando copas.</h1><p>Fechas de muestra. Antes de reservar, confirmá la información de cada encuentro.</p></div><div className="calendar-list">{Object.entries(groups).map(([month, calendarExperiences]) => <section className="calendar-group" key={month}><h2>{month}</h2><div>{calendarExperiences.map((experience) => <Link className="calendar-item" href={`/experiencias/${experience.slug}`} key={experience.slug}><time dateTime={experience.date}><strong>{formatExperienceDate(experience.date, { day: "2-digit" }).replace(/ de .*/, "")}</strong><span>{formatExperienceDate(experience.date, { weekday: "short" }).replace(".", "")}</span></time><div><p>{experience.category}</p><h3>{experience.title}</h3><span>{experience.time} h · {experience.location}</span></div><span className="calendar-item__arrow" aria-hidden="true">↗</span></Link>)}</div></section>)}</div></div></main>;
}
