import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/login/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { requireAdminUser } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return <div className="admin-root"><header className="admin-header"><div className="admin-header__inner"><Link className="admin-brand" href="/admin">CAVA<span>366</span><small>Administración</small></Link><AdminNavigation signOut={signOut} /></div></header><main className="admin-main">{children}</main></div>;
}
