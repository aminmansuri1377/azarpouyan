CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverKey" TEXT NOT NULL,
    "pdfKey" TEXT NOT NULL,
    "pdfSize" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Journal_published_sortOrder_createdAt_idx" ON "Journal"("published", "sortOrder", "createdAt");
