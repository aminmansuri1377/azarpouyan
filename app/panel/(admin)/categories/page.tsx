"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function CategoryPage() {
  const { data, isLoading } = trpc.category.getAll.useQuery();

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h1>Categories</h1>

      <Link href="/panel/categories/create">➕ Create Category</Link>

      <hr />

      {data?.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 10 }}>
          <b>{cat.slug}</b>

          <button
            onClick={() => deleteMutation.mutate({ id: cat.id })}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>

          <Link href={`/panel/categories/${cat.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
}
