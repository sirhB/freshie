export type SiteRate = { label: string; value: string };
export type SiteSocial = { platform: string; label: string; url: string };

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
  aboutBullets: string[];
  ratesEyebrow: string;
  rates: SiteRate[];
  ratesNote: string;
  hireEyebrow: string;
  hireHeadline: string;
  hireBody: string;
  socialEyebrow: string;
  socialHeadline: string;
  socials: SiteSocial[];
  footerLine: string;
};

export type PortfolioShape = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  platform: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  kind: string;
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
  aboutBullets: [
    "How-tos, unboxings, product demos & reviews for TikTok, Instagram, YouTube Shorts & Amazon",
    "On-camera storytelling — plus selfie product stills when the brief calls for it",
    "Partnered with BioSchwartz, Thinbi, Dr. Arthritis, MPG, Unlockt & Simply Nature's Pledge",
    "Based in New York City · English & Spanish · typical delivery about 4 days",
  ],
  ratesEyebrow: "Starting rates",
  rates: [
    { label: "UGC video", value: "$60–$100" },
    { label: "Sponsored post", value: "$100" },
    { label: "UGC images", value: "$15+" },
  ],
  ratesNote:
    "Brands she has worked with include BioSchwartz, Thinbi, Dr. Arthritis, MPG, Unlockt, and Simply Nature's Pledge. Campaigns typically deliver in about 4 days.",
  hireEyebrow: "Collaborate",
  hireHeadline: "Send a brief. She'll manage the obligations in studio.",
  hireBody:
    "Public inquiries land directly in Kayla's private portal — deadlines, deliverables, product tracking, guideline checklists, and payments in one place.",
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
    category: "Lifestyle",
    description: "Celebrating 40 years with Lifeway Kefir in NYC",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DZ71HwQx5sY/",
    thumbnailUrl: "/reels/lifeway-kefir.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    title: "Maybelline lip combo",
    category: "Beauty",
    description: "Maybelline Super Stay peel-off lip combo",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DdRd1DkxpUY/",
    thumbnailUrl: "/reels/maybelline-lip.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: "fallback-3",
    title: "Mini braids on natural hair",
    category: "Hair",
    description: "Mini braids styling on natural hair",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/Dc-IV8NxDJo/",
    thumbnailUrl: "/reels/mini-braids.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: "fallback-4",
    title: "OLAPLEX braid-out shine",
    category: "Hair",
    description: "OLAPLEX N°7 Bonding Oil on a braid-out",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/Dby9Zc1RwTW/",
    thumbnailUrl: "/reels/olaplex-braidout.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    id: "fallback-5",
    title: "OLAPLEX × Poppi duo",
    category: "Hair",
    description: "ICONIC duo — OLAPLEX and Poppi shake, spritz, shine",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DbtONb6x0b3/",
    thumbnailUrl: "/reels/olaplex-poppi.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 4,
  },
  {
    id: "fallback-6",
    title: "Wash day with OLAPLEX",
    category: "Hair",
    description: "Wash day with N°4 Curl Shampoo & N°5 Curl Conditioner",
    platform: "Instagram",
    mediaUrl: "https://www.instagram.com/reel/DaoWN4vRecs/",
    thumbnailUrl: "/reels/olaplex-washday.jpg",
    kind: "reel",
    featured: true,
    published: true,
    sortOrder: 5,
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
  aboutBullets: string;
  ratesEyebrow: string;
  ratesJson: string;
  ratesNote: string;
  hireEyebrow: string;
  hireHeadline: string;
  hireBody: string;
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
    aboutBullets: parseJson(row.aboutBullets, DEFAULT_SITE.aboutBullets),
    ratesEyebrow: row.ratesEyebrow,
    rates: parseJson(row.ratesJson, DEFAULT_SITE.rates),
    ratesNote: row.ratesNote,
    hireEyebrow: row.hireEyebrow,
    hireHeadline: row.hireHeadline,
    hireBody: row.hireBody,
    socialEyebrow: row.socialEyebrow,
    socialHeadline: row.socialHeadline,
    socials: parseJson(row.socialsJson, DEFAULT_SITE.socials),
    footerLine: row.footerLine,
  };
}
