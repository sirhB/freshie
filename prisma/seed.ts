import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import "../src/lib/db-url";

const prisma = new PrismaClient();

async function main() {
  await prisma.checklistItem.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.deal.deleteMany();
  // InquiryEvent may not exist until newer migrations are applied
  try {
    await prisma.inquiryEvent.deleteMany();
  } catch {
    /* ignore */
  }
  await prisma.inquiry.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("createher2026", 10);

  const kayla = await prisma.user.create({
    data: {
      email: "kayla@kaylathecreateher.com",
      name: "Kayla",
      passwordHash,
      role: "owner",
    },
  });

  const brands = await Promise.all(
    [
      { name: "BioSchwartz", niche: "Health & Supplements", contactEmail: "collabs@bioschwartz.com" },
      { name: "Thinbi", niche: "Beauty & Wellness", contactEmail: "partners@thinbi.com" },
      { name: "Dr. Arthritis", niche: "Health", contactEmail: "ugc@drarthritis.com" },
      { name: "Simply Nature's Pledge", niche: "Household", contactEmail: "hello@simplynaturespledge.com" },
      { name: "MPG", niche: "App", contactEmail: "creator@mpg.app" },
      { name: "Unlockt", niche: "Lifestyle", contactEmail: "brand@unlockt.co" },
    ].map((b) => prisma.brand.create({ data: b })),
  );

  const [bio, thinbi, arthritis, simply, mpg] = brands;

  const activeDeal = await prisma.deal.create({
    data: {
      title: "Hair glow serum How-To + unboxing",
      status: "active",
      platform: "TikTok + Instagram",
      contentType: "How-To",
      rateCents: 10000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
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
      ownerId: kayla.id,
      deliverables: {
        create: [
          { title: "TikTok How-To", format: "video", status: "editing", sortOrder: 0, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) },
          { title: "IG Reel cutdown", format: "video", status: "filming", sortOrder: 1, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) },
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
      title: "Joint support wellness review",
      status: "active",
      platform: "YouTube Shorts",
      contentType: "Product Review",
      rateCents: 10000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      usageRightsDays: 60,
      briefSummary: "Honest lifestyle review woven into morning wellness routine.",
      guidelines: "Disclose #ad. No disease claims. Keep authentic and calm.",
      productShipped: true,
      productReceived: false,
      trackingNumber: "1Z999AA10123456784",
      paymentStatus: "unpaid",
      brandId: arthritis.id,
      ownerId: kayla.id,
      deliverables: {
        create: [
          { title: "YouTube Short review", format: "video", status: "todo", sortOrder: 0 },
        ],
      },
      checklistItems: {
        create: [
          { label: "Wait for product arrival", sortOrder: 0 },
          { label: "Film morning routine context", sortOrder: 1 },
          { label: "Add paid partnership disclosure", sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.deal.create({
    data: {
      title: "Supplement stack demo set",
      status: "delivered",
      platform: "Amazon",
      contentType: "Product Demo",
      rateCents: 6000,
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      usageRightsDays: 365,
      briefSummary: "Amazon-ready product demo with clean white surface.",
      guidelines: "Amazon creative standards. No text overlays covering product.",
      productShipped: true,
      productReceived: true,
      paymentStatus: "paid",
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      brandId: bio.id,
      ownerId: kayla.id,
      deliverables: {
        create: [
          {
            title: "Amazon demo video",
            format: "video",
            status: "live",
            sortOrder: 0,
            deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            liveUrl: "https://www.amazon.com",
          },
        ],
      },
    },
  });

  await prisma.deal.create({
    data: {
      title: "Natural household unboxing",
      status: "negotiating",
      platform: "Instagram",
      contentType: "Unboxing",
      rateCents: 8000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      briefSummary: "Soft aesthetic unboxing for clean living audience.",
      brandId: simply.id,
      ownerId: kayla.id,
      paymentStatus: "unpaid",
    },
  });

  await prisma.deal.create({
    data: {
      title: "App walkthrough UGC",
      status: "paid",
      platform: "TikTok",
      contentType: "How-To",
      rateCents: 10000,
      paymentStatus: "paid",
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      brandId: mpg.id,
      ownerId: kayla.id,
      deliverables: {
        create: [
          { title: "TikTok walkthrough", format: "video", status: "live", sortOrder: 0 },
        ],
      },
    },
  });

  const webInquiry = await prisma.inquiry.create({
    data: {
      brandName: "Glow Ritual Co.",
      contactName: "Maya Chen",
      email: "maya@glowritual.co",
      budget: "$80–$120 / video",
      platforms: "TikTok, Instagram",
      message: "Looking for soft glam skincare UGC with authentic get-ready-with-me energy.",
      status: "new",
      source: "web",
      ownerId: kayla.id,
      events: {
        create: [
          { type: "created", message: "Inquiry received via web" },
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
      igSenderId: "ig_softsilk_demo",
      externalThreadId: "seed_ig_1",
      autoRepliedAt: new Date(),
      ownerId: kayla.id,
      events: {
        create: [
          { type: "created", message: "Inquiry received via instagram" },
          {
            type: "auto_replied",
            message: "Auto-reply sent via Instagram Messaging API",
          },
        ],
      },
    },
  });

  await prisma.portfolioItem.createMany({
    data: [
      { title: "Silk press how-to", category: "Hair", description: "Step-by-step heat protect + finish routine", platform: "TikTok", featured: true, sortOrder: 0 },
      { title: "Serum unboxing", category: "Beauty", description: "First impressions with soft natural light", platform: "Instagram", featured: true, sortOrder: 1 },
      { title: "Morning wellness stack", category: "Wellness", description: "Calm lifestyle review for supplements", platform: "YouTube Shorts", featured: true, sortOrder: 2 },
      { title: "Outfit texture reel", category: "Fashion", description: "Movement-led apparel storytelling", platform: "Instagram", featured: false, sortOrder: 3 },
      { title: "Amazon product demo", category: "Demo", description: "Clean surface demo built for conversion", platform: "Amazon", featured: true, sortOrder: 4 },
      { title: "Selfie product stills", category: "Images", description: "On-camera product detail set", platform: "UGC Images", featured: false, sortOrder: 5 },
    ],
  });

  console.log("Seeded Kayla portal. Login: kayla@kaylathecreateher.com / createher2026");
  console.log("Active deal id:", activeDeal.id);
  console.log("Sample web inquiry:", webInquiry.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
