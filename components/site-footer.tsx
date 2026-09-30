import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell site-footer__grid">
    <div><Link className="brand brand--footer" href="/">CAVA<span>366</span></Link><p>Vinos, catas y encuentros para compartir historias alrededor de una copa.</p></div>
    <div className="footer-links"><p>Explorar</p><Link href="/experiencias">Experiencias</Link><Link href="/calendario">Calendario</Link><Link href="/vinos">Vinos</Link></div>
    <div className="footer-links"><p>Hablemos</p><Link href="/contacto">Contacto</Link><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a></div>
  </div><div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} CAVA366</span><span>Los enlaces de contacto se configurarán con los perfiles oficiales.</span></div></footer>;
}
