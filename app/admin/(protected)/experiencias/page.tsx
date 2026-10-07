import Link from "next/link";
import { DeleteExperienceButton } from "@/components/admin/delete-experience-button";
import { formatExperienceDate } from "@/lib/experiences";
import { getAdminExperiences, getAdminStatusLabel } from "@/lib/admin/experiences";
import { togglePublished } from "./actions";

type Props = PageProps<"/admin/experiencias">;

function getMessage(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

export default async function AdminExperiencesPage({ searchParams }: Props) {
  const [experiences, params] = await Promise.all([getAdminExperiences(), searchParams]);
  const success = getMessage(params.success);
  const error = getMessage(params.error);

  return <section className="admin-page"><div className="admin-page__heading"><div><p className="admin-kicker">Agenda</p><h1>Experiencias</h1><p>Todas las experiencias, incluidas las que todavía no están publicadas.</p></div><Link className="admin-button admin-button--primary" href="/admin/experiencias/nueva">Nueva experiencia</Link></div>{success ? <p className="admin-notice admin-notice--success" role="status">{success}</p> : null}{error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Fecha</th><th>Experiencia</th><th>Lugar</th><th>Estado</th><th>Publicada</th><th>Destacada</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{experiences.map((experience) => <tr key={experience.id}><td>{formatExperienceDate(experience.date, { day: "2-digit", month: "2-digit", year: "numeric" })}</td><td><strong>{experience.title}</strong><small>/{experience.slug}</small></td><td>{experience.venueName}</td><td><span className={`admin-badge admin-badge--${experience.status}`}>{getAdminStatusLabel(experience.status)}</span></td><td>{experience.published ? "Sí" : "No"}</td><td>{experience.featured ? "Sí" : "No"}</td><td><div className="admin-row-actions"><Link className="admin-action" href={`/admin/experiencias/${experience.id}/editar`}>Editar</Link><form action={togglePublished}><input type="hidden" name="id" value={experience.id} /><input type="hidden" name="published" value={String(!experience.published)} /><button className="admin-action" type="submit">{experience.published ? "Despublicar" : "Publicar"}</button></form><DeleteExperienceButton id={experience.id} title={experience.title} /></div></td></tr>)}</tbody></table>{experiences.length === 0 ? <div className="admin-table-empty">Todavía no hay experiencias cargadas.</div> : null}</div></section>;
}
