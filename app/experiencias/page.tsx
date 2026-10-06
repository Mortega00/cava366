import type { Metadata } from "next";
import { ExperienceCard } from "@/components/experience-card";
import { getPublishedExperiences } from "@/lib/experiences";

export const metadata: Metadata = { title: "Experiencias", description: "Explorá las próximas catas y experiencias de CAVA366." };

export default async function ExperiencesPage() {
  const experiences = await getPublishedExperiences();
  return <main><section className="page-hero page-hero--experiences"><div className="shell"><p className="eyebrow eyebrow--light">Experiencias</p><h1>Vino para mirar,<br />escuchar y compartir.</h1><p>Encuentros que se mueven entre botellas, lugares y buenas conversaciones.</p></div></section><section className="section section--cream page-listing"><div className="shell"><div className="listing-topline"><p>Próximos encuentros</p><span>Agenda de muestra</span></div><div className="experience-grid experience-grid--all">{experiences.map((experience) => <ExperienceCard key={experience.slug} experience={experience} />)}</div></div></section></main>;
}
