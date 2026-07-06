"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { CategoryFilterCascade } from "@/components/category/CategoryFilterCascade";
import { ProductSearch } from "@/components/site/ProductSearch";
import { Pagination } from "@/components/site/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const utils = trpc.useUtils();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Category از URL خوانده می‌شود
  const categoryFilter = searchParams.get("categoryId") ?? undefined;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  const { data: categories = [], error: categoriesError } =
    trpc.category.getAll.useQuery();
  useEffect(() => {
    if (categoriesError) {
      toast.error(categoriesError.message || "خطا در دریافت کتگوری‌ها");
    }
  }, [categoriesError]);
  const { data, isLoading, isFetching, error, refetch } =
    trpc.product.getAll.useQuery(
      {
        categoryId: categoryFilter,
        search: debouncedSearch,
        page,
        limit,
      },
      {
        retry: false,
      },
    );
  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت محصولات");
    }
  }, [error]);

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: async () => {
      toast.success("محصول حذف شد");

      await utils.product.getAll.invalidate();
    },

    onError(error) {
      toast.error(error.message || "خطا در حذف محصول");
    },
  });

  const selectedCategory = categories.find((c) => c.id === categoryFilter);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>
          {selectedCategory
            ? `Products - ${selectedCategory.translations?.[0]?.name}`
            : "Products"}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Link href="/panel/products">Show All Products</Link>

          <Link href="/panel/products/create">Create Product</Link>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <CategoryFilterCascade
          categories={categories}
          value={categoryFilter}
          onChange={(value) => {
            setPage(1);

            if (value) {
              router.push(`/panel/products?categoryId=${value}`);
            } else {
              router.push("/panel/products");
            }
          }}
        />

        <ProductSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

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
      </div>

      <div
        style={{
          marginBottom: 15,
          fontWeight: 600,
        }}
      >
        Total Products: {data?.total ?? 0}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
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
              {data?.items?.length ? (
                data.items.map((product) => (
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
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: 30,
                    }}
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
