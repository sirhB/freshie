-- Allow CMS to swap the homepage hero image
ALTER TABLE "SiteContent" ADD COLUMN "heroImageUrl" TEXT NOT NULL DEFAULT '/kayla-hero.jpg';

UPDATE "SiteContent"
SET "heroImageUrl" = '/kayla-hero.jpg', "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton';
