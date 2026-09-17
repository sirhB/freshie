-- Refresh brand credits from recent Instagram partnerships (Maybelline, OLAPLEX, Ulta, etc.)
UPDATE "SiteContent"
SET
  "aboutBullets" = '["How-tos, unboxings, product demos & reviews for TikTok, Instagram, YouTube Shorts & Amazon","On-camera storytelling — plus selfie product stills when the brief calls for it","Partnered with Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji & Loma Lux","Based in New York City · English & Spanish · typical delivery about 4 days"]',
  "ratesNote" = 'Brands she has worked with include Maybelline, OLAPLEX, Ulta Beauty, Lifeway, Poppi, TPH by Taraji, Loma Lux, BioSchwartz, Thinbi, and Dr. Arthritis. Campaigns typically deliver in about 4 days.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton';
