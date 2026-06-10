"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function ProductsPage() {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.product.getAll.useQuery();

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>Products</h1>

        <Link href="/panel/products/create">Create Product</Link>
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Category</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((product) => (
            <tr key={product.id}>
              <td>{product.translations?.[0]?.name}</td>

              <td>{product.slug}</td>

              <td>{product.category?.translations?.[0]?.name}</td>

              <td>{product.published ? "Yes" : "No"}</td>

              <td>
                <Link href={`/panel/products/${product.id}`}>Edit</Link>

                {" | "}

                <button
                  onClick={() =>
                    deleteMutation.mutate({
                      id: product.id,
                    })
                  }
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
