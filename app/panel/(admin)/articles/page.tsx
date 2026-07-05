"use client";
import { ContentListPage } from "@/components/content/ContentList";

export default function ArticlesPage() {
  return <ContentListPage type="ARTICLE" basePath="/panel/articles" />;
}
