"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

import { PublicCategoryTree } from "@/components/PublicCategoryTree";

import { ProductSearch } from "@/components/ProductSearch";

import { Pagination } from "@/components/Pagination";

import { useDebounce } from "@/hooks/useDebounce";

export default function HomePage() {
  const params = useParams();

  const locale = params.locale as string;

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  const { data: categories } = trpc.public.getCategoryTree.useQuery({
    locale,
  });

  const shouldSearch = debouncedSearch.trim().length > 0;

  const { data: products, isFetching } = trpc.public.searchProducts.useQuery(
    {
      locale,

      search: debouncedSearch,

      page,

      limit: 12,
    },
    {
      enabled: shouldSearch,
    },
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>KGA Commerce</h1>

      <hr />

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <ProductSearch value={search} onChange={setSearch} />
      </div>

      {shouldSearch ? (
        <>
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
            Total Results: {products?.total ?? 0}
          </div>

          {products?.items.length === 0 ? (
            <div>No Products Found</div>
          ) : (
            products?.items.map((product) => {
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
            totalPages={products?.totalPages ?? 0}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          {categories && (
            <PublicCategoryTree locale={locale} categories={categories} />
          )}
        </>
      )}
    </div>
  );
}
