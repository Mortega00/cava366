import Link from "next/link";

const navItems = [
  { href: "/experiencias", label: "Experiencias" }, { href: "/calendario", label: "Calendario" }, { href: "/vinos", label: "Vinos" }, { href: "/cava366", label: "CAVA366" },
];

export function SiteHeader() {
  return <header className="site-header"><div className="shell site-header__inner">
    <Link className="brand" href="/" aria-label="CAVA366, inicio">CAVA<span>366</span></Link>
    <nav className="desktop-nav" aria-label="Navegación principal">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
    <Link className="header-contact" href="/contacto">Contacto <span aria-hidden="true">↗</span></Link>
    <details className="mobile-nav"><summary aria-label="Abrir navegación">Menú</summary><nav aria-label="Navegación móvil">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/contacto">Contacto</Link></nav></details>
  </div></header>;
}
