/*
  Warnings:

  - A unique constraint covering the columns `[languageId,slug]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[languageId,slug]` on the table `ProductTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_languageId_slug_key" ON "public"."CategoryTranslation"("languageId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_languageId_slug_key" ON "public"."ProductTranslation"("languageId", "slug");
