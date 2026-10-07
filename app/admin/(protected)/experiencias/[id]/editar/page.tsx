import Link from "next/link";
import { ExperienceForm } from "@/components/admin/experience-form";
import { getAdminExperience } from "@/lib/admin/experiences";
import { updateExperience } from "../../actions";

type Props = PageProps<"/admin/experiencias/[id]/editar">;

export default async function EditExperiencePage({ params, searchParams }: Props) {
  const { id } = await params;
  const [experience, query] = await Promise.all([getAdminExperience(id), searchParams]);
  const success = typeof query.success === "string" ? query.success : null;
  const error = typeof query.error === "string" ? query.error : null;
  const updateForExperience = updateExperience.bind(null, experience.id);

  return <section className="admin-page admin-page--form"><div className="admin-page__heading"><div><p className="admin-kicker">Editar experiencia</p><h1>{experience.title}</h1><p>Los cambios se guardan en la experiencia existente.</p></div><Link className="admin-button admin-button--secondary" href="/admin/experiencias">Volver al listado</Link></div>{success ? <p className="admin-notice admin-notice--success" role="status">{success}</p> : null}{error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}<div className="admin-panel"><ExperienceForm action={updateForExperience} experience={experience} submitLabel="Guardar cambios" /></div></section>;
}
