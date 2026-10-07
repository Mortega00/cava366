import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/login/actions";
import { requireAdminUser } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdminUser();

  return <div className="admin-root"><header className="admin-header"><div className="admin-header__inner"><Link className="admin-brand" href="/admin">CAVA<span>366</span><small>Administración</small></Link><nav aria-label="Navegación de administración"><Link href="/admin">Inicio</Link><Link href="/admin/experiencias">Experiencias</Link><Link href="/admin/experiencias/nueva">Nueva experiencia</Link></nav><div className="admin-account"><span>{user.email}</span><form action={signOut}><button type="submit">Cerrar sesión</button></form></div></div></header><main className="admin-main">{children}</main></div>;
}
