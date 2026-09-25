import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import "../src/lib/db-url";

const prisma = new PrismaClient();

/**
 * Safe by default: upserts Kayla's user + site content, only seeds demo deals/inquiries
 * when the database has no deals yet.
 *
 * Destructive full reset (local/dev only):
 *   SEED_RESET=true npm run db:seed
 */
async function wipeAll() {
  await prisma.checklistItem.deleteMany();
  await prisma.attachment.deleteMany().catch(() => undefined);
  await prisma.deliverable.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.notification.deleteMany().catch(() => undefined);
  try {
    await prisma.inquiryMessage.deleteMany();
  } catch {
    /* ignore */
  }
  try {
    await prisma.inquiryEvent.deleteMany();
  } catch {
    /* ignore */
  }
  await prisma.inquiry.deleteMany();
  await prisma.dealTemplate.deleteMany().catch(() => undefined);
  await prisma.brand.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.siteContent.deleteMany().catch(() => undefined);
  await prisma.user.deleteMany();
}

async function ensureKayla(passwordHash: string) {
  return prisma.user.upsert({
    where: { email: "kayla@kaylathecreateher.com" },
    update: { name: "Kayla", role: "owner" },
    create: {
      email: "kayla@kaylathecreateher.com",
      name: "Kayla",
      passwordHash,
      role: "owner",
    },
  });
}

async function ensureSiteContent() {
  const aboutBullets = JSON.stringify([
    "How-tos, unboxings, product demos & reviews for TikTok, Instagram, YouTube Shorts & Amazon",
    "On-camera storytelling — plus selfie product stills when the brief calls for it",
    "Partnered with Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji & Loma Lux",
    "Based in New York City · English & Spanish · typical delivery about 4 days",
  ]);
  const ratesJson = JSON.stringify([
    { label: "UGC video", value: "$60–$100" },
    { label: "Sponsored post", value: "$100" },
    { label: "UGC images", value: "$15+" },
  ]);
  const ratesNote =
    "Brands she has worked with include Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji, Loma Lux, BioSchwartz, Thinbi, and Dr. Arthritis. Campaigns typically deliver in about 4 days.";
  const socialsJson = JSON.stringify([
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
  ]);

  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {
      aboutBullets,
      ratesNote,
      socialsJson,
      aboutBodyEs:
        "Soy Kayla (Rickalia N.) — creadora de contenido en Nueva York. Mi mundo gira en torno al cabello natural, la belleza como autocuidado, el wellness, el lifestyle y la moda. Creo y hablo en cámara en inglés y español.",
      aboutBulletsEs: JSON.stringify([
        "Tutoriales, unboxings, demos y reseñas para TikTok, Instagram, YouTube Shorts y Amazon",
        "Storytelling frente a cámara — y selfies de producto cuando el brief lo pide",
        "Colaboraciones con Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji y Loma Lux",
        "Basada en Nueva York · inglés y español · entrega típica ~4 días",
      ]),
      pressLogosJson: JSON.stringify([
        { name: "Maybelline", url: "" },
        { name: "OLAPLEX", url: "" },
        { name: "Ulta Beauty", url: "" },
        { name: "Lifeway", url: "" },
        { name: "Poppi", url: "" },
      ]),
      bookingLabel: "Book a call",
    },
    create: {
      id: "singleton",
      heroEyebrow: "UGC · New York City · English & Spanish",
      heroImageUrl: "/kayla-hero.jpg",
      workHeadline:
        "Reels from @kaylathecreateher — hair, beauty, and lifestyle in motion.",
      aboutEyebrow: "About me",
      aboutHeadline: "A journey of self-expression and exploration.",
      aboutBody:
        "I'm Kayla (Rickalia N.) — a passionate creative content creator based in New York City. My world revolves around the beauty of hair, the art of beauty, the significance of wellness, the magic of lifestyle, and the ever-evolving trends of fashion. I create and speak on camera in English and Spanish.",
      aboutBodyEs:
        "Soy Kayla (Rickalia N.) — creadora de contenido en Nueva York. Mi mundo gira en torno al cabello natural, la belleza como autocuidado, el wellness, el lifestyle y la moda. Creo y hablo en cámara en inglés y español.",
      aboutBullets,
      aboutBulletsEs: JSON.stringify([
        "Tutoriales, unboxings, demos y reseñas para TikTok, Instagram, YouTube Shorts y Amazon",
        "Storytelling frente a cámara — y selfies de producto cuando el brief lo pide",
        "Colaboraciones con Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji y Loma Lux",
        "Basada en Nueva York · inglés y español · entrega típica ~4 días",
      ]),
      ratesJson,
      ratesNote,
      pressLogosJson: JSON.stringify([
        { name: "Maybelline", url: "" },
        { name: "OLAPLEX", url: "" },
        { name: "Ulta Beauty", url: "" },
        { name: "Lifeway", url: "" },
        { name: "Poppi", url: "" },
      ]),
      bookingLabel: "Book a call",
      socialsJson,
      footerLine:
        "New York City · English & Spanish · Hair · Beauty · Wellness · Lifestyle · Fashion",
    },
  });
}

async function seedDemoData(kaylaId: string) {
  const { DEFAULT_DEAL_TEMPLATES } = await import("../src/lib/deal-templates");
  await prisma.dealTemplate.createMany({ data: DEFAULT_DEAL_TEMPLATES });

  const brands = await Promise.all(
    [
      { name: "Maybelline", niche: "Beauty", contactEmail: "creators@maybelline.com" },
      { name: "OLAPLEX", niche: "Hair", contactEmail: "partners@olaplex.com" },
      { name: "Ulta Beauty", niche: "Beauty Retail", contactEmail: "ugc@ulta.com" },
      { name: "Lifeway", niche: "Health & Wellness", contactEmail: "collabs@lifeway.net" },
      { name: "BioSchwartz", niche: "Health & Supplements", contactEmail: "collabs@bioschwartz.com" },
      { name: "Thinbi", niche: "Beauty & Wellness", contactEmail: "partners@thinbi.com" },
    ].map((b) => prisma.brand.create({ data: b })),
  );

  const [maybelline, olaplex, , , , thinbi] = brands;

  const activeDeal = await prisma.deal.create({
    data: {
      title: "Hair glow serum How-To + unboxing",
      status: "active",
      platform: "TikTok + Instagram",
      contentType: "How-To",
      rateCents: 10000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      publishDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      usageRightsDays: 90,
      briefSummary: "Face-to-camera how-to showing application + 3-day hair feel.",
      guidelines:
        "Show full product label. No medical claims. Soft natural lighting. Include CTA to shop link in bio. Keep under 30s for TikTok, 15-30s Reel cut.",
      talkingPoints: "Lightweight serum\nVisible shine without grease\nFits morning routine",
      productShipped: true,
      productReceived: true,
      trackingNumber: "9400111899223344556677",
      paymentStatus: "invoiced",
      brandId: thinbi.id,
      ownerId: kaylaId,
      deliverables: {
        create: [
          {
            title: "TikTok How-To",
            format: "video",
            status: "editing",
            sortOrder: 0,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          },
          {
            title: "IG Reel cutdown",
            format: "video",
            status: "filming",
            sortOrder: 1,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          },
          { title: "Product flat-lay stills", format: "image", status: "todo", sortOrder: 2 },
        ],
      },
      checklistItems: {
        create: [
          { label: "Show product packaging clearly", sortOrder: 0, done: true },
          { label: "Mention key benefit in first 3 seconds", sortOrder: 1, done: true },
          { label: "No competitor mentions", sortOrder: 2, done: false },
          { label: "End with soft CTA", sortOrder: 3, done: false },
          { label: "Send draft for brand review", sortOrder: 4, done: false },
        ],
      },
    },
  });

  await prisma.deal.create({
    data: {
      title: "Maybelline lip combo Reel",
      status: "negotiating",
      platform: "Instagram",
      contentType: "Product Review",
      rateCents: 10000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      brandId: maybelline.id,
      ownerId: kaylaId,
      briefSummary: "Gifted Super Stay peel-off lip combo — soft glam demo.",
      deliverables: {
        create: [{ title: "IG Reel", format: "video", status: "todo", sortOrder: 0 }],
      },
      checklistItems: {
        create: [
          { label: "Confirm talking points", sortOrder: 0 },
          { label: "Film primary deliverable", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.deal.create({
    data: {
      title: "OLAPLEX wash-day Shorts",
      status: "active",
      platform: "YouTube Shorts",
      contentType: "How-To",
      rateCents: 8000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      brandId: olaplex.id,
      ownerId: kaylaId,
      paymentStatus: "unpaid",
      deliverables: {
        create: [{ title: "Wash day Short", format: "video", status: "todo", sortOrder: 0 }],
      },
      checklistItems: {
        create: [{ label: "Show N°4 + N°5 clearly", sortOrder: 0 }],
      },
    },
  });

  const webInquiry = await prisma.inquiry.create({
    data: {
      brandName: "Glow Ritual Co.",
      contactName: "Ava Chen",
      email: "ava@glowritual.co",
      budget: "$80–$120",
      platforms: "TikTok, Instagram",
      message:
        "Hi Kayla! We love your natural hair content and want a 20–30s UGC how-to for our leave-in mist. Product ships next week.",
      status: "new",
      source: "web",
      leadScore: 72,
      leadTier: "hot",
      ownerId: kaylaId,
      events: {
        create: [{ type: "created", message: "Inquiry received via web · score 72 (hot)" }],
      },
      messages: {
        create: [
          {
            direction: "inbound",
            body: "Hi Kayla! We love your natural hair content and want a 20–30s UGC how-to for our leave-in mist. Product ships next week.",
          },
        ],
      },
    },
  });

  await prisma.inquiry.create({
    data: {
      brandName: "Soft Silk Labs",
      contactName: "Instagram a1b2c3",
      email: "ig.demo_softsilk@instagram.local",
      platforms: "Instagram DM",
      message:
        "Hi Kayla! We loved your hair content. Can you create a soft glam leave-in mist Reel for us?",
      status: "reviewed",
      source: "instagram",
      leadScore: 58,
      leadTier: "maybe",
      igSenderId: "ig_softsilk_demo",
      externalThreadId: "seed_ig_1",
      autoRepliedAt: new Date(),
      ownerId: kaylaId,
      events: {
        create: [
          { type: "created", message: "Inquiry received via instagram · score 58 (maybe)" },
          {
            type: "auto_replied",
            message: "Auto-reply sent via Instagram Messaging API",
          },
        ],
      },
      messages: {
        create: [
          {
            direction: "inbound",
            body: "Hi Kayla! We loved your hair content. Can you create a soft glam leave-in mist Reel for us?",
            externalId: "seed_ig_1",
          },
          {
            direction: "outbound",
            body: "Hey! Thanks for reaching out to kaylathecreateher ✨",
          },
        ],
      },
    },
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Lifeway Kefir 40 years",
        slug: "lifeway-kefir-40",
        category: "Lifestyle",
        description: "Celebrating 40 years with Lifeway Kefir in NYC",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/DZ71HwQx5sY/",
        thumbnailUrl: "/reels/lifeway-kefir.jpg",
        kind: "reel",
        brandName: "Lifeway",
        featured: true,
        published: true,
        sortOrder: 0,
      },
      {
        title: "Maybelline lip combo",
        slug: "maybelline-lip-combo",
        category: "Beauty",
        description: "Maybelline Super Stay peel-off lip combo",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/DdRd1DkxpUY/",
        thumbnailUrl: "/reels/maybelline-lip.jpg",
        kind: "reel",
        brandName: "Maybelline",
        featured: true,
        published: true,
        sortOrder: 1,
      },
      {
        title: "Mini braids on natural hair",
        slug: "mini-braids",
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
        title: "OLAPLEX braid-out shine",
        slug: "olaplex-braidout",
        category: "Hair",
        description: "OLAPLEX N°7 Bonding Oil on a braid-out",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/Dby9Zc1RwTW/",
        thumbnailUrl: "/reels/olaplex-braidout.jpg",
        kind: "reel",
        brandName: "OLAPLEX",
        featured: true,
        published: true,
        sortOrder: 3,
      },
      {
        title: "OLAPLEX × Poppi duo",
        slug: "olaplex-poppi",
        category: "Hair",
        description: "ICONIC duo — OLAPLEX and Poppi shake, spritz, shine",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/DbtONb6x0b3/",
        thumbnailUrl: "/reels/olaplex-poppi.jpg",
        kind: "reel",
        brandName: "OLAPLEX",
        featured: true,
        published: true,
        sortOrder: 4,
      },
      {
        title: "Wash day with OLAPLEX",
        slug: "olaplex-washday",
        category: "Hair",
        description: "Wash day with N°4 Curl Shampoo & N°5 Curl Conditioner",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/DaoWN4vRecs/",
        thumbnailUrl: "/reels/olaplex-washday.jpg",
        kind: "reel",
        brandName: "OLAPLEX",
        featured: true,
        published: true,
        sortOrder: 5,
      },
      {
        title: "Maybelline Super Stay lip story",
        slug: "case-maybelline-super-stay",
        category: "Beauty",
        description:
          "Paid UGC reel + stills that turned a peel-off lip combo into a routine moment.",
        platform: "Instagram",
        mediaUrl: "https://www.instagram.com/reel/DdRd1DkxpUY/",
        thumbnailUrl: "/reels/maybelline-lip.jpg",
        kind: "case_study",
        brandName: "Maybelline",
        caseBody:
          "Brief called for a soft glam demo of Maybelline Super Stay peel-off lip. Kayla filmed face-to-camera application, texture close-ups, and a wear check — then delivered stills for ads.\n\nTurnaround: 4 days. English on-camera.",
        resultsNote:
          "Brand reused stills in paid social; Reel drove save-worthy routine content.",
        featured: true,
        published: true,
        sortOrder: 10,
      },
    ],
  });

  await prisma.notification.create({
    data: {
      userId: kaylaId,
      type: "inquiry",
      title: "New inquiry · Glow Ritual Co.",
      body: "Ava Chen via web · $80–$120",
      href: "/studio/inquiries",
    },
  });

  return { activeDeal, webInquiry };
}

async function main() {
  const reset = process.env.SEED_RESET === "true";
  if (reset) {
    console.log("SEED_RESET=true — wiping database…");
    await wipeAll();
  }

  const initialPassword =
    process.env.SEED_OWNER_PASSWORD || (reset || process.env.NODE_ENV !== "production" ? "createher2026" : null);
  if (!initialPassword && !(await prisma.user.findUnique({ where: { email: "kayla@kaylathecreateher.com" } }))) {
    throw new Error(
      "No owner user exists. Set SEED_OWNER_PASSWORD (or SEED_RESET=true locally) before seeding.",
    );
  }

  const passwordHash = await hash(initialPassword || "createher2026", 10);
  const kayla = await ensureKayla(
    // Only set password on create / reset — upsert update path leaves hash alone unless reset
    passwordHash,
  );

  if (reset && initialPassword) {
    await prisma.user.update({
      where: { id: kayla.id },
      data: { passwordHash },
    });
  }

  await ensureSiteContent();

  const templateCount = await prisma.dealTemplate.count();
  if (templateCount === 0) {
    const { DEFAULT_DEAL_TEMPLATES } = await import("../src/lib/deal-templates");
    await prisma.dealTemplate.createMany({ data: DEFAULT_DEAL_TEMPLATES });
    console.log("Seeded deal templates.");
  }

  const dealCount = await prisma.deal.count();
  const portfolioCount = await prisma.portfolioItem.count();

  if (dealCount === 0) {
    const { activeDeal, webInquiry } = await seedDemoData(kayla.id);
    console.log("Seeded demo deals + inquiries.");
    console.log("Active deal id:", activeDeal.id);
    console.log("Sample web inquiry:", webInquiry.id);
  } else {
    console.log(`Skipped demo deals (already have ${dealCount}).`);
  }

  if (portfolioCount === 0 && dealCount > 0) {
    // Site may exist without reels — leave CMS to fill; no wipe.
    console.log("Portfolio empty but deals exist — add reels in Studio → Site.");
  }

  console.log("Owner ready: kayla@kaylathecreateher.com");
  if (reset || dealCount === 0) {
    console.log("Temporary password set — change it in Studio → Settings after login.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
