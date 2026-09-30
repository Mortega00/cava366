import type { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    slug: "copas-y-muros", title: "Copas y muros", date: "2026-10-16", time: "20:00", location: "Espacio histórico · CABA", price: "Valor a confirmar", category: "Arquitectura", featured: true,
    shortDescription: "Un recorrido entre vinos, texturas y detalles de un espacio con historia.",
    description: "Una cata pensada para detenerse en los detalles: la copa, el lugar y las historias que aparecen cuando miramos más despacio.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Algo rico para acompañar", "Recorrido por el espacio"], image: "/images/cava366-hero.png", imageAlt: "Mesa de vinos iluminada por velas",
  },
  {
    slug: "la-mesa-compartida", title: "La mesa compartida", date: "2026-10-29", time: "20:30", location: "Mesa gastronómica · CABA", price: "Valor a confirmar", category: "Gastronomía", featured: true,
    shortDescription: "Vino, bocados y una mesa preparada para quedarse un rato más.",
    description: "Un encuentro alrededor de sabores que se buscan entre sí. La selección de vinos acompaña una mesa pensada para probar y conversar.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Propuesta gastronómica", "Maridajes para descubrir"], image: "/images/cava366-hero.png", imageAlt: "Copas de vino y una mesa con luz cálida",
  },
  {
    slug: "vinilo-y-vino", title: "Vinilo y vino", date: "2026-11-12", time: "21:00", location: "Patio cultural · CABA", price: "Valor a confirmar", category: "Música", featured: true,
    shortDescription: "Una escucha atenta: canciones, vinos y tiempo para compartirlos.",
    description: "Una noche para escuchar y probar sin apuro. Cada copa abre una pequeña pausa entre un lado y otro del vinilo.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Escucha musical", "Algo rico para acompañar"], image: "/images/cava366-hero.png", imageAlt: "Mesa nocturna preparada para una cata",
  },
  {
    slug: "una-copa-entre-amigos", title: "Una copa entre amigos", date: "2026-11-26", time: "20:00", location: "Lugar a confirmar · CABA", price: "Valor a confirmar", category: "Encuentro", featured: false,
    shortDescription: "Una primera aproximación para disfrutar, preguntar y elegir nuevas botellas.",
    description: "Una cata cercana para quienes quieren descubrir vinos sin vueltas. Una mesa, algunas botellas y preguntas que no necesitan saber previo.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Guía simple para disfrutar", "Algo rico para acompañar"], image: "/images/cava366-hero.png", imageAlt: "Vino servido en una copa sobre una mesa oscura",
  },
];

export const getExperienceBySlug = (slug: string) => experiences.find((experience) => experience.slug === slug);

export function formatExperienceDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", ...options }).format(new Date(`${date}T12:00:00`));
}

export function groupExperiencesByMonth() {
  return experiences.reduce<Record<string, Experience[]>>((groups, experience) => {
    const month = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(new Date(`${experience.date}T12:00:00`));
    groups[month] ??= [];
    groups[month].push(experience);
    return groups;
  }, {});
}
