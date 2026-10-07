"use client";

import Link from "next/link";
import { useRef } from "react";

type AdminNavigationProps = {
  signOut: () => Promise<void>;
};

export function AdminNavigation({ signOut }: AdminNavigationProps) {
  const navigationRef = useRef<HTMLElement>(null);

  function closeOpenMenus(event: React.MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Element) || !event.target.closest("a")) return;

    navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => menu.removeAttribute("open"));
  }

  return <nav ref={navigationRef} className="admin-nav" aria-label="Navegación de administración" onClickCapture={closeOpenMenus}><Link href="/admin">Panel</Link><details className="admin-nav__group"><summary>Experiencias</summary><div className="admin-nav__menu"><Link href="/admin/experiencias">Ver experiencias</Link><Link href="/admin/experiencias/nueva">Nueva experiencia</Link></div></details><details className="admin-nav__group"><summary>Vinos</summary><div className="admin-nav__menu"><Link href="/admin/vinos">Ver vinos</Link><Link href="/admin/vinos/nuevo">Nuevo vino</Link></div></details><form action={signOut}><button type="submit">Cerrar sesión</button></form></nav>;
}
