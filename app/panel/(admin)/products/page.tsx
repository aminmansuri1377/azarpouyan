"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { CategoryFilterCascade } from "@/components/CategoryFilterCascade";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductSearch } from "@/components/ProductSearch";
import { Pagination } from "@/components/Pagination";

export default function ProductsPage() {
  const utils = trpc.useUtils();

  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);
  const { data: categories = [] } = trpc.category.getAll.useQuery();

  const { data, isLoading, isFetching } = trpc.product.getAll.useQuery({
    categoryId: categoryFilter,
    search: debouncedSearch,
    page,
    limit,
  });
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate();
    },
  });
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, debouncedSearch]);

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
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <CategoryFilterCascade
          categories={categories}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />

        <ProductSearch value={search} onChange={setSearch} />
      </div>
      {isFetching && (
        <span
          style={{
            fontSize: 13,
            color: "#888",
          }}
        >
          Searching...
        </span>
      )}

      <div
        style={{
          marginBottom: 15,
          fontWeight: 600,
        }}
      >
        Total Products: {data?.length ?? 0}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
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
            {data?.items?.map((product) => (
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
      )}
      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
