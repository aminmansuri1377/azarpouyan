CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "comments_published_sortOrder_createdAt_idx" ON "comments"("published", "sortOrder", "createdAt");
