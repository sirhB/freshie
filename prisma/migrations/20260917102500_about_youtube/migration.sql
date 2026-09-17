-- Refresh public site defaults: JoinBrands about (NYC + Spanish) + YouTube social
UPDATE "SiteContent"
SET
  "heroEyebrow" = 'UGC · New York City · English & Spanish',
  "aboutEyebrow" = 'About me',
  "aboutHeadline" = 'A journey of self-expression and exploration.',
  "aboutBody" = 'I''m Kayla (Rickalia N.) — a passionate creative content creator based in New York City. My world revolves around the beauty of hair, the art of beauty, the significance of wellness, the magic of lifestyle, and the ever-evolving trends of fashion. I create and speak on camera in English and Spanish.',
  "aboutBullets" = '["How-tos, unboxings, product demos & reviews for TikTok, Instagram, YouTube Shorts & Amazon","On-camera storytelling — plus selfie product stills when the brief calls for it","Partnered with BioSchwartz, Thinbi, Dr. Arthritis, MPG, Unlockt & Simply Nature''s Pledge","Based in New York City · English & Spanish · typical delivery about 4 days"]',
  "ratesNote" = 'Brands she has worked with include BioSchwartz, Thinbi, Dr. Arthritis, MPG, Unlockt, and Simply Nature''s Pledge. Campaigns typically deliver in about 4 days.',
  "socialsJson" = '[{"platform":"Instagram","label":"@kaylathecreateher","url":"https://www.instagram.com/kaylathecreateher/"},{"platform":"YouTube","label":"@kaylathecreateher","url":"https://www.youtube.com/@kaylathecreateher"},{"platform":"Threads","label":"@kaylathecreateher","url":"https://www.threads.net/@kaylathecreateher"},{"platform":"Email","label":"kaylarcollab@gmail.com","url":"mailto:kaylarcollab@gmail.com"},{"platform":"Assistant","label":"Speak with my assistant","url":"https://chat.linka.ai/liveagent/rickalia"}]',
  "footerLine" = 'New York City · English & Spanish · Hair · Beauty · Wellness · Lifestyle · Fashion',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton';
