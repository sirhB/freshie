export type SiteRate = { label: string; value: string };
export type SiteSocial = { platform: string; label: string; url: string };
export type PressLogo = { name: string; url: string };

export type SiteContentShape = {
  heroEyebrow: string;
  heroHeadline: string;
  heroTagline: string;
  heroImageUrl: string;
  workEyebrow: string;
  workHeadline: string;
  aboutEyebrow: string;
  aboutHeadline: string;
  aboutBody: string;
  aboutBodyEs: string;
  aboutBullets: string[];
  aboutBulletsEs: string[];
  ratesEyebrow: string;
  rates: SiteRate[];
  ratesNote: string;
  hireEyebrow: string;
  hireHeadline: string;
  hireBody: string;
  bookingUrl: string;
  bookingLabel: string;
  pressLogos: PressLogo[];
  socialEyebrow: string;
  socialHeadline: string;
  socials: SiteSocial[];
  footerLine: string;
};

export type PortfolioShape = {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  description: string | null;
  platform: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  kind: string;
  caseBody: string | null;
  resultsNote: string | null;
  brandName: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export const DEFAULT_SITE: SiteContentShape = {
  heroEyebrow: "UGC · New York City · English & Spanish",
  heroHeadline: "kaylathecreateher",
  heroTagline:
    "Celebrating natural hair in all its glory — beauty, wellness, lifestyle, and fashion content that helps you feel your most confident self.",
  heroImageUrl: "/kayla-hero.jpg",
  workEyebrow: "The work",
  workHeadline: "Reels from @kaylathecreateher — hair, beauty, and lifestyle in motion.",
  aboutEyebrow: "About me",
  aboutHeadline: "A journey of self-expression and exploration.",
  aboutBody:
    "I'm Kayla (Rickalia N.) — a passionate creative content creator based in New York City. My world revolves around the beauty of hair, the art of beauty, the significance of wellness, the magic of lifestyle, and the ever-evolving trends of fashion. I create and speak on camera in English and Spanish.",
  aboutBodyEs:
    "Soy Kayla (Rickalia N.) — creadora de contenido en Nueva York. Mi mundo gira en torno al cabello natural, la belleza como autocuidado, el wellness, el lifestyle y la moda. Creo y hablo en cámara en inglés y español.",
  aboutBullets: [
    "How-tos, unboxings, product demos & reviews for TikTok, Instagram, YouTube Shorts & Amazon",
    "On-camera storytelling — plus selfie product stills when the brief calls for it",
    "Partnered with Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji & Loma Lux",
    "Based in New York City · English & Spanish · typical delivery about 4 days",
  ],
  aboutBulletsEs: [
    "Tutoriales, unboxings, demos y reseñas para TikTok, Instagram, YouTube Shorts y Amazon",
    "Storytelling frente a cámara — y selfies de producto cuando el brief lo pide",
    "Colaboraciones con Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji y Loma Lux",
    "Basada en Nueva York · inglés y español · entrega típica ~4 días",
  ],
  ratesEyebrow: "Starting rates",
  rates: [
    { label: "UGC video", value: "$60–$100" },
    { label: "Sponsored post", value: "$100" },
    { label: "UGC images", value: "$15+" },
  ],
  ratesNote:
    "Brands she has worked with include Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji, Loma Lux, BioSchwartz, Thinbi, and Dr. Arthritis. Campaigns typically deliver in about 4 days.",
  hireEyebrow: "Collaborate",
  hireHeadline: "Send a brief. She'll manage the obligations in studio.",
  hireBody:
    "Public inquiries land directly in Kayla's private portal — deadlines, deliverables, product tracking, guideline checklists, and payments in one place.",
  bookingUrl: "",
  bookingLabel: "Book a call",
  pressLogos: [
    { name: "Maybelline", url: "" },
    { name: "OLAPLEX", url: "" },
    { name: "Ulta Beauty", url: "" },
    { name: "Lifeway", url: "" },
    { name: "Poppi", url: "" },
  ],
  socialEyebrow: "Find Kayla",
  socialHeadline: "Follow the createher journey.",
  socials: [
    {
      platform: "Instagram",
      label: "@kaylathecreateher",
      url: "https://www.instagram.com/kaylathecreateher/",
    },
    {
      platform: "YouTube",
      label: "@kaylathecreateher",
      url: "https://www.youtube.com/@kaylathecreateher",
    },
    {
      platform: "Threads",
      label: "@kaylathecreateher",
      url: "https://www.threads.net/@kaylathecreateher",
    },
    {
      platform: "Email",
      label: "kaylarcollab@gmail.com",
      url: "mailto:kaylarcollab@gmail.com",
    },
    {
      platform: "Assistant",
      label: "Speak with my assistant",
      url: "https://chat.linka.ai/liveagent/rickalia",
    },
  ],
  footerLine: "New York City · English & Spanish · Hair · Beauty · Wellness · Lifestyle · Fashion",
};

export const FALLBACK_PORTFOLIO: PortfolioShape[] = [
  {
    id: "fallback-1",
    title: "Lifeway Kefir 40 years",
    slug: "lifeway-kefir-40",
    category: "Lifestyle",
    description: "Celebrating 40 years with Lifeway Kefir in NYC",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DZ71HwQx5sY/",
    thumbnailUrl: "/reels/lifeway-kefir.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: "Lifeway",
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    title: "Maybelline lip combo",
    slug: "maybelline-lip-combo",
    category: "Beauty",
    description: "Maybelline Super Stay peel-off lip combo",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DdRd1DkxpUY/",
    thumbnailUrl: "/reels/maybelline-lip.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: "Maybelline",
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: "fallback-3",
    title: "Mini braids on natural hair",
    slug: "mini-braids",
    category: "Hair",
    description: "Mini braids styling on natural hair",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/Dc-IV8NxDJo/",
    thumbnailUrl: "/reels/mini-braids.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: null,
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: "fallback-4",
    title: "OLAPLEX braid-out shine",
    slug: "olaplex-braidout",
    category: "Hair",
    description: "OLAPLEX N°7 Bonding Oil on a braid-out",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/Dby9Zc1RwTW/",
    thumbnailUrl: "/reels/olaplex-braidout.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: "OLAPLEX",
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    id: "fallback-5",
    title: "OLAPLEX × Poppi duo",
    slug: "olaplex-poppi",
    category: "Hair",
    description: "ICONIC duo — OLAPLEX and Poppi shake, spritz, shine",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DbtONb6x0b3/",
    thumbnailUrl: "/reels/olaplex-poppi.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: "OLAPLEX",
    featured: true,
    published: true,
    sortOrder: 4,
  },
  {
    id: "fallback-6",
    title: "Wash day with OLAPLEX",
    slug: "olaplex-washday",
    category: "Hair",
    description: "Wash day with N°4 Curl Shampoo & N°5 Curl Conditioner",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DaoWN4vRecs/",
    thumbnailUrl: "/reels/olaplex-washday.jpg",
    kind: "reel",
    caseBody: null,
    resultsNote: null,
    brandName: "OLAPLEX",
    featured: true,
    published: true,
    sortOrder: 5,
  },
  {
    id: "fallback-case-1",
    title: "Maybelline Super Stay lip story",
    slug: "case-maybelline-super-stay",
    category: "Beauty",
    description: "Paid UGC reel + stills that turned a peel-off lip combo into a routine moment.",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DdRd1DkxpUY/",
    thumbnailUrl: "/reels/maybelline-lip.jpg",
    kind: "case_study",
    caseBody:
      "Brief called for a soft glam demo of Maybelline Super Stay peel-off lip. Kayla filmed face-to-camera application, texture close-ups, and a wear check — then delivered stills for ads.\n\nTurnaround: 4 days. English on-camera.",
    resultsNote: "Brand reused stills in paid social; Reel drove save-worthy routine content.",
    brandName: "Maybelline",
    featured: true,
    published: true,
    sortOrder: 10,
  },
];

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function serializeSiteContent(row: {
  heroEyebrow: string;
  heroHeadline: string;
  heroTagline: string;
  heroImageUrl?: string | null;
  workEyebrow: string;
  workHeadline: string;
  aboutEyebrow: string;
  aboutHeadline: string;
  aboutBody: string;
  aboutBodyEs?: string | null;
  aboutBullets: string;
  aboutBulletsEs?: string | null;
  ratesEyebrow: string;
  ratesJson: string;
  ratesNote: string;
  hireEyebrow: string;
  hireHeadline: string;
  hireBody: string;
  bookingUrl?: string | null;
  bookingLabel?: string | null;
  pressLogosJson?: string | null;
  socialEyebrow: string;
  socialHeadline: string;
  socialsJson: string;
  footerLine: string;
}): SiteContentShape {
  return {
    heroEyebrow: row.heroEyebrow,
    heroHeadline: row.heroHeadline,
    heroTagline: row.heroTagline,
    heroImageUrl: row.heroImageUrl || DEFAULT_SITE.heroImageUrl,
    workEyebrow: row.workEyebrow,
    workHeadline: row.workHeadline,
    aboutEyebrow: row.aboutEyebrow,
    aboutHeadline: row.aboutHeadline,
    aboutBody: row.aboutBody,
    aboutBodyEs: row.aboutBodyEs || DEFAULT_SITE.aboutBodyEs,
    aboutBullets: parseJson(row.aboutBullets, DEFAULT_SITE.aboutBullets),
    aboutBulletsEs: parseJson(row.aboutBulletsEs, DEFAULT_SITE.aboutBulletsEs),
    ratesEyebrow: row.ratesEyebrow,
    rates: parseJson(row.ratesJson, DEFAULT_SITE.rates),
    ratesNote: row.ratesNote,
    hireEyebrow: row.hireEyebrow,
    hireHeadline: row.hireHeadline,
    hireBody: row.hireBody,
    bookingUrl: row.bookingUrl || "",
    bookingLabel: row.bookingLabel || DEFAULT_SITE.bookingLabel,
    pressLogos: parseJson(row.pressLogosJson, DEFAULT_SITE.pressLogos),
    socialEyebrow: row.socialEyebrow,
    socialHeadline: row.socialHeadline,
    socials: parseJson(row.socialsJson, DEFAULT_SITE.socials),
    footerLine: row.footerLine,
  };
}

export function serializePortfolioItem(item: {
  id: string;
  title: string;
  slug?: string | null;
  category: string;
  description: string | null;
  platform: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  kind: string;
  caseBody?: string | null;
  resultsNote?: string | null;
  brandName?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}): PortfolioShape {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug ?? null,
    category: item.category,
    description: item.description,
    platform: item.platform,
    mediaUrl: item.mediaUrl,
    thumbnailUrl: item.thumbnailUrl,
    kind: item.kind,
    caseBody: item.caseBody ?? null,
    resultsNote: item.resultsNote ?? null,
    brandName: item.brandName ?? null,
    featured: item.featured,
    published: item.published,
    sortOrder: item.sortOrder,
  };
}
