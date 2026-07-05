"use client";
import { ContentListPage } from "@/components/content/ContentList";

export default function BlogsPage() {
  return <ContentListPage type="BLOG" basePath="/panel/blogs" />;
}
