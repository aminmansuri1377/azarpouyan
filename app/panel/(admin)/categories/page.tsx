"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function CategoryPage() {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.category.getAll.useQuery();

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>Categories</h1>
        <Link href="/panel/categories/create">Create Category</Link>
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.translations?.[0]?.name ?? "-"}</td>
              <td>{cat.slug}</td>
              <td>{cat.published ? "Yes" : "No"}</td>
              <td>
                <Link href={`/panel/categories/${cat.id}`}>Edit</Link>
                {" | "}
                <button
                  onClick={() => {
                    if (confirm("Delete this category?")) {
                      deleteMutation.mutate({ id: cat.id });
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
