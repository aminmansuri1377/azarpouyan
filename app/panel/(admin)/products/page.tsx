"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { CategoryFilterCascade } from "@/components/category/CategoryFilterCascade";
import { ProductSearch } from "@/components/site/ProductSearch";
import { Pagination } from "@/components/site/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/Table";

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
    <div style={{ padding: 20 }} className=" font-peyda-regular">
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
            ? `محصولات - ${selectedCategory.translations?.[0]?.name}`
            : "محصولات"}
        </h1>
      </div>

      <div className=" flex justify-around">
        <Link
          href="/panel/products/create"
          className=" bg-primary py-2 px-8 m-4 rounded-2xl"
        >
          ساخت محصول{" "}
        </Link>

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
        <Link
          href="/panel/products"
          className=" bg-transparent py-2 px-8 m-4 rounded-2xl border-2 border-primary"
        >
          همه محصولات
        </Link>
      </div>
      <div className=" my-10">تعداد محصولات: {data?.total ?? 0}</div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عکس</TableHead>
                  <TableHead>نام</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>دسته بندی</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.items?.length ? (
                  data.items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.imageUrl ? (
                          <div className="relative h-[50px] w-[50px]">
                            <Image
                              src={product.imageUrl}
                              alt={
                                product.translations?.[0]?.name ?? product.slug
                              }
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-[50px] w-[50px] rounded bg-muted" />
                        )}
                      </TableCell>

                      <TableCell>{product.translations?.[0]?.name}</TableCell>

                      <TableCell>{product.slug}</TableCell>

                      <TableCell>
                        {product.category?.translations?.[0]?.name}
                      </TableCell>

                      <TableCell>{product.published ? "Yes" : "No"}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/panel/products/${product.id}`}
                            className="text-primary hover:underline"
                          >
                            ویرایش
                          </Link>

                          <span className="text-muted-foreground">|</span>

                          <button
                            onClick={() =>
                              deleteMutation.mutate({
                                id: product.id,
                              })
                            }
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:underline disabled:opacity-50"
                          >
                            حذف
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      هنوز هیچ محصولی ثبت نشده{" "}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
