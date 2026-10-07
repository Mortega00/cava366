import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getExperienceAvailabilityLabel, getPublishedExperiences } from "@/lib/experiences";

export const metadata: Metadata = { title: "Calendario", description: "Agenda de próximas catas y experiencias de CAVA366." };

const CAVA366_WHATSAPP_URL = "https://wa.me/5491131031414";
const CALENDAR_MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

type Props = PageProps<"/calendario">;

function formatCalendarDatePart(date: string, options: Intl.DateTimeFormatOptions) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { ...options, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function getDateParts(date: string) {
  const [year, month] = date.split("-").map(Number);
  return { year, month };
}

function getQueryNumber(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const number = Number(candidate);
  return Number.isInteger(number) ? number : null;
}

function getCalendarHref(year: number, month: number) {
  return `/calendario?year=${year}&month=${month}`;
}

export default async function CalendarPage({ searchParams }: Props) {
  const experiences = await getPublishedExperiences();
  const query = await searchParams;
  const experiencesWithDates = experiences.map((experience) => ({ experience, ...getDateParts(experience.date) }));
  const years = [...new Set(experiencesWithDates.map(({ year }) => year))].sort((first, second) => first - second);
  const requestedYear = getQueryNumber(query.year);
  const selectedYear = requestedYear !== null && years.includes(requestedYear) ? requestedYear : years[0] ?? null;
  const availableMonths = selectedYear === null ? [] : [...new Set(experiencesWithDates.filter(({ year }) => year === selectedYear).map(({ month }) => month))].sort((first, second) => first - second);
  const requestedMonth = getQueryNumber(query.month);
  const selectedMonth = requestedMonth !== null && availableMonths.includes(requestedMonth) ? requestedMonth : availableMonths[0] ?? null;
  const monthExperiences = selectedYear === null || selectedMonth === null ? [] : experiencesWithDates.filter(({ year, month }) => year === selectedYear && month === selectedMonth).map(({ experience }) => experience);

  return (
    <main className="section section--cream calendar-page calendar-agenda">
      <div className="shell">
        <header className="calendar-agenda__heading">
          <p className="eyebrow">Calendario</p>
          <h1>Próximas experiencias.</h1>
          <p>Una agenda para elegir dónde empieza la próxima copa.</p>
        </header>

        {selectedYear !== null && selectedMonth !== null ? (
          <>
            <nav className="calendar-agenda__time-navigation" aria-label="Seleccionar fecha de experiencias">
              <div className="calendar-agenda__years">
                {years.map((year) => {
                  const firstAvailableMonth = experiencesWithDates.find((item) => item.year === year)?.month;
                  const targetMonth = year === selectedYear && selectedMonth !== null ? selectedMonth : firstAvailableMonth;
                  const isActive = year === selectedYear;

                  return <Link className={`calendar-agenda__year${isActive ? " calendar-agenda__year--active" : ""}`} href={getCalendarHref(year, targetMonth ?? 1)} aria-current={isActive ? "page" : undefined} key={year}>{year}</Link>;
                })}
              </div>
              <div className="calendar-agenda__month-links" aria-label={`Meses con experiencias en ${selectedYear}`}>
                {CALENDAR_MONTHS.map((label, index) => {
                  const month = index + 1;
                  const isAvailable = availableMonths.includes(month);
                  const isActive = month === selectedMonth;

                  return isAvailable ? <Link className={`calendar-agenda__month-link${isActive ? " calendar-agenda__month-link--active" : ""}`} href={getCalendarHref(selectedYear, month)} aria-current={isActive ? "page" : undefined} key={label}>{label}</Link> : <span className="calendar-agenda__month-link calendar-agenda__month-link--unavailable" aria-disabled="true" key={label}>{label}</span>;
                })}
              </div>
            </nav>
            <section className="calendar-agenda__selection">
              <p className="calendar-agenda__selection-count">{monthExperiences.length === 1 ? "Una experiencia" : `${monthExperiences.length} experiencias`}</p>
              <div className={`calendar-agenda__grid calendar-agenda__grid--${Math.min(monthExperiences.length, 3)}`}>
                {monthExperiences.map((experience) => {
                    const availabilityLabel = getExperienceAvailabilityLabel(experience);
                    const hasDistinctLocation = experience.location !== experience.venueName;

                    return (
                      <article className="calendar-agenda__card" key={experience.slug}>
                        {experience.imageUrl ? (
                          <div className="calendar-agenda__visual">
                            <Image src={experience.imageUrl} alt={experience.imageAlt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" className="calendar-agenda__image" />
                          </div>
                        ) : (
                          <div className="calendar-agenda__visual calendar-agenda__visual--placeholder" aria-hidden="true">
                            <span>CAVA366</span>
                          </div>
                        )}

                        <div className="calendar-agenda__card-content">
                          <time className="calendar-agenda__date" dateTime={experience.date}>
                            <strong>{formatCalendarDatePart(experience.date, { day: "2-digit" })}</strong>
                            <span>{formatCalendarDatePart(experience.date, { month: "short" }).replace(".", "").toUpperCase()}</span>
                          </time>
                          <div className="calendar-agenda__card-copy">
                            <p className="calendar-agenda__category">{experience.category}</p>
                            <h3>{experience.title}</h3>
                            <p className="calendar-agenda__place">{experience.venueName}{hasDistinctLocation ? <><span aria-hidden="true"> · </span>{experience.location}</> : null}</p>
                            <p className="calendar-agenda__time">{experience.time} h</p>
                          </div>
                          <div className="calendar-agenda__card-footer">
                            <div>
                              {availabilityLabel ? <p className={`calendar-agenda__availability calendar-agenda__availability--${experience.status}`}>{availabilityLabel}</p> : null}
                              <p className="calendar-agenda__price">{experience.price}</p>
                            </div>
                            <Link className="calendar-agenda__link" href={`/experiencias/${experience.slug}`}>Ver experiencia <span aria-hidden="true">↗</span></Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          </>
        ) : (
          <section className="calendar-agenda__empty">
            <p>No hay nuevas fechas publicadas por el momento.</p>
            <a className="calendar-agenda__link" href={CAVA366_WHATSAPP_URL} target="_blank" rel="noreferrer">Hablar con CAVA366 <span aria-hidden="true">↗</span></a>
          </section>
        )}
      </div>
    </main>
  );
}
