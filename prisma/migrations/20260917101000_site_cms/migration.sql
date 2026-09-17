-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN "mediaUrl" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN "thumbnailUrl" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'reel';
ALTER TABLE "PortfolioItem" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'UGC · New York City',
    "heroHeadline" TEXT NOT NULL DEFAULT 'kaylathecreateher',
    "heroTagline" TEXT NOT NULL DEFAULT 'Celebrating natural hair in all its glory — beauty, wellness, lifestyle, and fashion content that helps you feel your most confident self.',
    "workEyebrow" TEXT NOT NULL DEFAULT 'The work',
    "workHeadline" TEXT NOT NULL DEFAULT 'Content that celebrates unique beauty — every hair type and texture.',
    "aboutEyebrow" TEXT NOT NULL DEFAULT 'About Kayla',
    "aboutHeadline" TEXT NOT NULL DEFAULT 'A journey of self-expression and exploration.',
    "aboutBody" TEXT NOT NULL DEFAULT 'I''m Kayla — a passionate creative content creator based in New York City. My world revolves around the beauty of hair, the art of beauty, the significance of wellness, the magic of lifestyle, and the ever-evolving trends of fashion.',
    "aboutBullets" TEXT NOT NULL DEFAULT '["Curating content that celebrates natural hair in all its glory","Inspiring every hair type and texture to embrace unique beauty","Skincare as self-care — tips, tricks, and beauty trends that build confidence","Lifestyle rooted in balance, fitness, and wellness — plus fashion that evolves"]',
    "ratesEyebrow" TEXT NOT NULL DEFAULT 'Starting rates',
    "ratesJson" TEXT NOT NULL DEFAULT '[{"label":"UGC video","value":"$60–$100"},{"label":"Sponsored post","value":"$100"},{"label":"UGC images","value":"$15+"}]',
    "ratesNote" TEXT NOT NULL DEFAULT 'Brands she has worked with include BioSchwartz, Thinbi, Dr. Arthritis, MPG, Unlockt, and Simply Nature''s Pledge.',
    "hireEyebrow" TEXT NOT NULL DEFAULT 'Collaborate',
    "hireHeadline" TEXT NOT NULL DEFAULT 'Send a brief. She''ll manage the obligations in studio.',
    "hireBody" TEXT NOT NULL DEFAULT 'Public inquiries land directly in Kayla''s private portal — deadlines, deliverables, product tracking, guideline checklists, and payments in one place.',
    "socialEyebrow" TEXT NOT NULL DEFAULT 'Find Kayla',
    "socialHeadline" TEXT NOT NULL DEFAULT 'Follow the createher journey.',
    "socialsJson" TEXT NOT NULL DEFAULT '[{"platform":"Instagram","label":"@kaylathecreateher","url":"https://www.instagram.com/kaylathecreateher/"},{"platform":"Threads","label":"@kaylathecreateher","url":"https://www.threads.net/@kaylathecreateher"},{"platform":"Email","label":"kaylarcollab@gmail.com","url":"mailto:kaylarcollab@gmail.com"},{"platform":"Assistant","label":"Speak with my assistant","url":"https://chat.linka.ai/liveagent/rickalia"}]',
    "footerLine" TEXT NOT NULL DEFAULT 'New York City · Hair · Beauty · Wellness · Lifestyle · Fashion',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);
