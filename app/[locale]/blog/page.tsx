"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function BlogPage() {
  const params = useParams();

  const locale = params.locale as string;

  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = trpc.public.getBlogs.useQuery({
    locale,
  });
  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت");
    }
  }, [error]);
  return (
    <div style={{ padding: 30 }}>
      <h1>Blogs</h1>

      {blogs?.map((blog) => {
        const t = blog.translations[0];

        if (!t) return null;

        return (
          <div key={blog.id}>
            <Link href={`/${locale}/blog/${t.slug}`}>{t.title}</Link>
          </div>
        );
      })}
    </div>
  );
}
