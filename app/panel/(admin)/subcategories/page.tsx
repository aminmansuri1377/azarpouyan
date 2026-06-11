"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function SubCategoriesPage() {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.subCategory.getAll.useQuery();

  const deleteMutation = trpc.subCategory.delete.useMutation({
    onSuccess: async () => {
      await utils.subCategory.getAll.invalidate();
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
        <h1>Sub Categories</h1>
        <Link href="/panel/subcategories/create">Create SubCategory</Link>
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.translations?.[0]?.name ?? "-"}</td>
              <td>
                {item.category?.translations?.[0]?.name ?? item.categoryId}
              </td>
              <td>{item.published ? "Yes" : "No"}</td>
              <td>
                <Link href={`/panel/subcategories/${item.id}`}>Edit</Link>
                {" | "}
                <button
                  onClick={() => {
                    if (confirm("Delete this subcategory?")) {
                      deleteMutation.mutate({ id: item.id });
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
