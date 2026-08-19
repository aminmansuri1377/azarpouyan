"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

import { ProductSearch } from "@/components/site/ProductSearch";

import { Pagination } from "@/components/site/Pagination";

import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";
import { useDecodedParams } from "@/hooks/useDecodedParam";

export default function CategoryPage() {
  const params = useDecodedParams<{ locale: string; slug: string }>();

  const locale = params.locale as string;

  const slug = params.slug as string;

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching, error } =
    trpc.public.getCategoryPage.useQuery(
      {
        locale,
        slug,
        search: debouncedSearch,
        page,
        limit: 12,
      },
      {
        placeholderData: (previousData) => previousData,
      },
    );
  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت");
    }
  }, [error]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div className="m-40">
      <h1>{data.category.name}</h1>

      <hr />

      <h2>Sub Categories</h2>

      {data.children.length === 0 ? (
        <div>No Sub Categories</div>
      ) : (
        data.children.map((child: any) => {
          const t = child.translations[0];

          return (
            <div key={child.id}>
              <Link href={`/${locale}/category/${t.slug}`}>{t.name}</Link>
            </div>
          );
        })
      )}

      <hr />

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <ProductSearch
          value={search}
          onChange={(value) => {
            setSearch(value);

            setPage(1);
          }}
        />
      </div>

      {isFetching && (
        <div
          style={{
            marginBottom: 10,
          }}
        >
          Searching...
        </div>
      )}

      <div
        style={{
          marginBottom: 15,
          fontWeight: 600,
        }}
      >
        Total Products: {data.total}
      </div>

      <h2>Products</h2>

      {data.products.length === 0 ? (
        <div>No Products Found</div>
      ) : (
        data.products.map((product) => {
          const t = product.translations[0];

          return (
            <div
              key={product.id}
              style={{
                marginBottom: 10,
              }}
            >
              <Link href={`/${locale}/products/${t.slug}`}>{t.name}</Link>
            </div>
          );
        })
      )}

      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
