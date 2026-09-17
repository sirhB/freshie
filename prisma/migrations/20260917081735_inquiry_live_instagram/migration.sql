/*
  Warnings:

  - Added the required column `updatedAt` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "InquiryEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inquiryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InquiryEvent_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "budget" TEXT,
    "platforms" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'web',
    "igSenderId" TEXT,
    "externalThreadId" TEXT,
    "autoRepliedAt" DATETIME,
    "convertedDealId" TEXT,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inquiry" ("brandName", "budget", "contactName", "createdAt", "email", "id", "message", "ownerId", "platforms", "status", "updatedAt") SELECT "brandName", "budget", "contactName", "createdAt", "email", "id", "message", "ownerId", "platforms", "status", "createdAt" FROM "Inquiry";
DROP TABLE "Inquiry";
ALTER TABLE "new_Inquiry" RENAME TO "Inquiry";
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");
CREATE INDEX "Inquiry_source_idx" ON "Inquiry"("source");
CREATE INDEX "Inquiry_igSenderId_idx" ON "Inquiry"("igSenderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "InquiryEvent_inquiryId_idx" ON "InquiryEvent"("inquiryId");
