-- AlterTable User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "alertEmail" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "alertPhone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailAlertsOn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "smsAlertsOn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable Brand
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "contactName" TEXT;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable Deal
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "publishDate" TIMESTAMP(3);
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "usageRightsEndsAt" TIMESTAMP(3);
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT;
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "invoiceUrl" TEXT;
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "paymentLinkUrl" TEXT;

-- AlterTable Deliverable
ALTER TABLE "Deliverable" ADD COLUMN IF NOT EXISTS "publishDate" TIMESTAMP(3);

-- AlterTable Attachment
ALTER TABLE "Attachment" ADD COLUMN IF NOT EXISTS "inquiryId" TEXT;
CREATE INDEX IF NOT EXISTS "Attachment_inquiryId_idx" ON "Attachment"("inquiryId");

-- AlterTable Notification
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "emailedAt" TIMESTAMP(3);
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "smsSentAt" TIMESTAMP(3);

-- AlterTable Inquiry
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "leadScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "leadTier" TEXT NOT NULL DEFAULT 'maybe';
CREATE INDEX IF NOT EXISTS "Inquiry_leadTier_idx" ON "Inquiry"("leadTier");

-- AlterTable PortfolioItem
ALTER TABLE "PortfolioItem" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN IF NOT EXISTS "caseBody" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN IF NOT EXISTS "resultsNote" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN IF NOT EXISTS "brandName" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioItem_slug_key" ON "PortfolioItem"("slug");

-- AlterTable SiteContent
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "aboutBodyEs" TEXT NOT NULL DEFAULT 'Soy Kayla (Rickalia N.) — creadora de contenido en Nueva York. Mi mundo gira en torno al cabello natural, la belleza como autocuidado, el wellness, el lifestyle y la moda. Creo y hablo en cámara en inglés y español.';
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "aboutBulletsEs" TEXT NOT NULL DEFAULT '["Tutoriales, unboxings, demos y reseñas para TikTok, Instagram, YouTube Shorts y Amazon","Storytelling frente a cámara — y selfies de producto cuando el brief lo pide","Colaboraciones con Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji y Loma Lux","Basada en Nueva York · inglés y español · entrega típica ~4 días"]';
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "bookingUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "bookingLabel" TEXT NOT NULL DEFAULT 'Book a call';
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "pressLogosJson" TEXT NOT NULL DEFAULT '[{"name":"Maybelline","url":""},{"name":"OLAPLEX","url":""},{"name":"Ulta Beauty","url":""},{"name":"Lifeway","url":""},{"name":"Poppi","url":""}]';

-- CreateTable DealTemplate
CREATE TABLE IF NOT EXISTS "DealTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "rateCents" INTEGER NOT NULL DEFAULT 10000,
    "briefSummary" TEXT,
    "guidelines" TEXT,
    "talkingPoints" TEXT,
    "usageRightsDays" INTEGER DEFAULT 90,
    "deliverablesJson" TEXT NOT NULL DEFAULT '[]',
    "checklistJson" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DealTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable InquiryMessage
CREATE TABLE IF NOT EXISTS "InquiryMessage" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InquiryMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "InquiryMessage_inquiryId_createdAt_idx" ON "InquiryMessage"("inquiryId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "InquiryMessage" ADD CONSTRAINT "InquiryMessage_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
