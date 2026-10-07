import Link from "next/link";
import { getAdminExperiences } from "@/lib/admin/experiences";

export default async function AdminHomePage() {
  const experiences = await getAdminExperiences();
  const stats = [
    ["Experiencias", experiences.length],
    ["Publicadas", experiences.filter((experience) => experience.published).length],
    ["Borradores", experiences.filter((experience) => !experience.published).length],
    ["Destacadas", experiences.filter((experience) => experience.featured).length],
  ];

  return <section className="admin-page"><div className="admin-page__heading"><div><p className="admin-kicker">Resumen</p><h1>Experiencias</h1><p>Gestioná la agenda pública de CAVA366 desde un único lugar.</p></div><Link className="admin-button admin-button--primary" href="/admin/experiencias/nueva">Nueva experiencia</Link></div><div className="admin-stats">{stats.map(([label, value]) => <article key={label as string}><span>{label}</span><strong>{value}</strong></article>)}</div><div className="admin-panel admin-empty-state"><p>Agenda</p><h2>Administrá las experiencias publicadas y los próximos borradores.</h2><Link className="admin-text-link" href="/admin/experiencias">Ver todas las experiencias <span aria-hidden="true">→</span></Link></div></section>;
}
