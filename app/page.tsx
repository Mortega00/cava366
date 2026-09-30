import Image from "next/image";
import Link from "next/link";
import { ExperienceCard } from "@/components/experience-card";
import { SectionHeading } from "@/components/section-heading";
import { experiences } from "@/data/experiences";

const modes = [
  ["01", "Vino + arquitectura", "Copas que abren otra forma de mirar los espacios que habitamos."],
  ["02", "Vino + gastronomía", "Maridajes pensados para conversar, probar y volver a descubrir."],
  ["03", "Vino + música", "Encuentros donde el ritmo también acompaña a cada copa."],
  ["04", "Lugares únicos", "Experiencias que cambian de escenario, pero conservan la misma intención."],
];

export default function Home() {
  const featured = experiences.filter((experience) => experience.featured).slice(0, 3);
  return <>
    <section className="hero"><Image src="/images/cava366-hero.png" alt="Mesa de vinos a la luz de las velas en un espacio histórico" fill priority sizes="100vw" className="hero__image" /><div className="hero__overlay" />
      <div className="hero__content shell"><p className="eyebrow eyebrow--light">CAVA366 · Vino y experiencias</p><h1>Una copa puede ser el principio de una historia.</h1><p className="hero__lede">Catas, encuentros y vinos elegidos para compartir con tiempo.</p><div className="button-row"><Link className="button button--light" href="/experiencias">Explorar experiencias <span aria-hidden="true">↗</span></Link><Link className="button button--ghost" href="/vinos">Descubrir vinos</Link></div></div>
      <p className="hero__caption">Una escena de referencia. Próximamente, videos y material de cada encuentro.</p>
    </section>
    <main>
      <section className="section section--cream"><div className="shell"><SectionHeading eyebrow="Próximas experiencias" title="Elegí dónde empieza tu próxima copa." action={{ href: "/calendario", label: "Ver agenda" }} /><p className="notice">Agenda de muestra: las fechas y lugares reales se confirmarán antes de la publicación.</p><div className="experience-grid">{featured.map((experience) => <ExperienceCard key={experience.slug} experience={experience} />)}</div></div></section>
      <section className="section section--ink narrative-section"><div className="shell narrative-section__grid"><div><p className="eyebrow eyebrow--gold">Más que una cata</p><h2>El vino siempre conversa con algo más.</h2></div><p className="narrative-section__lede">CAVA366 imagina encuentros donde el vino se cruza con la mesa, la música, la arquitectura y las historias de cada lugar.</p></div><div className="shell mode-grid">{modes.map(([index, title, copy]) => <article className="mode-card" key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="section section--sand"><div className="shell portrait-feature"><div className="portrait-placeholder" role="img" aria-label="Espacio reservado para una foto o video de Pichu"><span>Retrato / video de Pichu</span><i aria-hidden="true" /></div><div className="portrait-feature__copy"><p className="eyebrow">CAVA366 + Pichu</p><h2>Detrás de cada copa hay una historia.</h2><p>Pichu es sommelier y la persona que crea y guía cada experiencia. La invitación es simple: mirar, probar y dejar que una copa abra una conversación.</p><Link className="text-link" href="/cava366">Conocer CAVA366 <span aria-hidden="true">→</span></Link></div></div></section>
      <section className="section section--wine wine-intro"><div className="shell wine-intro__grid"><div><p className="eyebrow eyebrow--gold">Vinos elegidos</p><h2>Para llevar la experiencia a tu mesa.</h2><p>Una selección en movimiento, elegida con el mismo criterio que guía las catas. Próximamente, también con envíos a domicilio.</p><Link className="button button--light" href="/vinos">Explorar vinos <span aria-hidden="true">↗</span></Link></div><div className="bottle-composition" aria-hidden="true"><div className="bottle-composition__disc" /><div className="bottle bottle--back" /><div className="bottle bottle--front" /><p>Selección CAVA366</p></div></div></section>
      <section className="section final-cta"><div className="shell final-cta__inner"><p className="eyebrow">Encontrémonos</p><h2>Las próximas fechas empiezan acá.</h2><div className="button-row"><Link className="button button--dark" href="/calendario">Ver próximas fechas</Link><Link className="button button--outline" href="/contacto">Escribir a CAVA366</Link></div></div></section>
    </main>
  </>;
}
