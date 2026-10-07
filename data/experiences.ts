import type { Experience } from "@/types/experience";

/**
 * Temporary resilience fallback. Remove this module after Supabase is the only
 * required source and the public experience data no longer needs a safety net.
 */
export const fallbackExperiences: Experience[] = [
  {
    slug: "copas-y-muros", title: "Copas y muros", date: "2026-10-16", time: "20:00", venueName: "Espacio histórico", location: "CABA", locationLabel: "Espacio histórico · CABA", price: "Valor a confirmar", category: "Arquitectura", featured: true, status: "available", statusLabel: "Disponible", capacityTotal: null, spotsAvailable: null,
    shortDescription: "Un recorrido entre vinos, texturas y detalles de un espacio con historia.",
    description: "Una cata pensada para detenerse en los detalles: la copa, el lugar y las historias que aparecen cuando miramos más despacio.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Algo rico para acompañar", "Recorrido por el espacio"], image: "/images/cava366-hero.png", imageAlt: "Mesa de vinos iluminada por velas",
  },
  {
    slug: "la-mesa-compartida", title: "La mesa compartida", date: "2026-10-29", time: "20:30", venueName: "Mesa gastronómica", location: "CABA", locationLabel: "Mesa gastronómica · CABA", price: "Valor a confirmar", category: "Gastronomía", featured: true, status: "available", statusLabel: "Disponible", capacityTotal: null, spotsAvailable: null,
    shortDescription: "Vino, bocados y una mesa preparada para quedarse un rato más.",
    description: "Un encuentro alrededor de sabores que se buscan entre sí. La selección de vinos acompaña una mesa pensada para probar y conversar.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Propuesta gastronómica", "Maridajes para descubrir"], image: "/images/cava366-hero.png", imageAlt: "Copas de vino y una mesa con luz cálida",
  },
  {
    slug: "vinilo-y-vino", title: "Vinilo y vino", date: "2026-11-12", time: "21:00", venueName: "Patio cultural", location: "CABA", locationLabel: "Patio cultural · CABA", price: "Valor a confirmar", category: "Música", featured: true, status: "available", statusLabel: "Disponible", capacityTotal: null, spotsAvailable: null,
    shortDescription: "Una escucha atenta: canciones, vinos y tiempo para compartirlos.",
    description: "Una noche para escuchar y probar sin apuro. Cada copa abre una pequeña pausa entre un lado y otro del vinilo.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Escucha musical", "Algo rico para acompañar"], image: "/images/cava366-hero.png", imageAlt: "Mesa nocturna preparada para una cata",
  },
  {
    slug: "una-copa-entre-amigos", title: "Una copa entre amigos", date: "2026-11-26", time: "20:00", venueName: "Lugar a confirmar", location: "CABA", locationLabel: "Lugar a confirmar · CABA", price: "Valor a confirmar", category: "Encuentro", featured: false, status: "available", statusLabel: "Disponible", capacityTotal: null, spotsAvailable: null,
    shortDescription: "Una primera aproximación para disfrutar, preguntar y elegir nuevas botellas.",
    description: "Una cata cercana para quienes quieren descubrir vinos sin vueltas. Una mesa, algunas botellas y preguntas que no necesitan saber previo.",
    includes: ["Cata guiada por Pichu", "Selección de vinos", "Guía simple para disfrutar", "Algo rico para acompañar"], image: "/images/cava366-hero.png", imageAlt: "Vino servido en una copa sobre una mesa oscura",
  },
];
