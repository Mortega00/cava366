import { redirect } from "next/navigation";
import { signIn } from "@/app/admin/login/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Props = PageProps<"/admin/login">;

export default async function AdminLoginPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const message = typeof error === "string" ? error : null;

  return <main className="admin-root admin-login"><section className="admin-login__card"><p className="admin-kicker">CAVA366</p><h1>Administración</h1><p className="admin-login__intro">Ingresá con tu cuenta autorizada para gestionar las experiencias.</p>{message ? <p className="admin-notice admin-notice--error" role="alert">{message}</p> : null}<form action={signIn} className="admin-form"><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label><button className="admin-button admin-button--primary" type="submit">Ingresar</button></form></section></main>;
}
