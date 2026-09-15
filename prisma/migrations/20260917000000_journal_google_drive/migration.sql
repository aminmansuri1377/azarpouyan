-- Preserve legacy object references while allowing new Google Drive journals.
ALTER TABLE "Journal"
  ADD COLUMN "pdfUrl" TEXT,
  ALTER COLUMN "pdfKey" DROP NOT NULL,
  ALTER COLUMN "pdfSize" DROP NOT NULL;
