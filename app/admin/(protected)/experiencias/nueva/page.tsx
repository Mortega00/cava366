import Link from "next/link";
import { ExperienceForm } from "@/components/admin/experience-form";
import { createExperience } from "../actions";

type Props = PageProps<"/admin/experiencias/nueva">;

export default async function NewExperiencePage({ searchParams }: Props) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? error : null;

  return <section className="admin-page admin-page--form"><div className="admin-page__heading"><div><p className="admin-kicker">Nueva experiencia</p><h1>Crear experiencia</h1><p>Completá la información que verá el público cuando la experiencia esté publicada.</p></div><Link className="admin-button admin-button--secondary" href="/admin/experiencias">Volver al listado</Link></div>{message ? <p className="admin-notice admin-notice--error" role="alert">{message}</p> : null}<div className="admin-panel"><ExperienceForm action={createExperience} submitLabel="Guardar experiencia" /></div></section>;
}
