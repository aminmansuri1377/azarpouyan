"use client";
import { CategoryTree } from "@/components/CategoryTree";

export default function CategoriesPage() {
  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>مدیریت کتگوری‌ها</h1>
      <div style={{ padding: 20 }}>
        <CategoryTree />
      </div>
    </>
  );
}
