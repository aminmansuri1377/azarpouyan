-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "images" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectTranslation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "specifications" TEXT,
    "description" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,

    CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_idx" ON "public"."Project"("published");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_languageId_key" ON "public"."ProjectTranslation"("projectId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_languageId_slug_key" ON "public"."ProjectTranslation"("languageId", "slug");

-- AddForeignKey
ALTER TABLE "public"."ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
