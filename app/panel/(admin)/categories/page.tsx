"use client";
import { CategoryTree } from "@/components/category/CategoryTree";

export default function CategoriesPage() {
  return (
    <div className=" text-right">
      <h1 className=" font-peyda-bold text-center mx-auto my-10">
        مدیریت کتگوری‌ها
      </h1>
      <div style={{ padding: 20 }}>
        <CategoryTree />
      </div>
    </div>
  );
}
