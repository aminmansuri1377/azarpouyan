"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

import { trpc } from "@/lib/trpc/client";
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
} from "@/components/ui/Table";

export default function ProjectsAdminPage() {
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching, error } =
    trpc.project.getAll.useQuery(
      {
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
      toast.error(error.message || "خطا در دریافت پروژه‌ها");
    }
  }, [error]);

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: async () => {
      toast.success("پروژه با موفقیت حذف شد");
      await utils.project.getAll.invalidate();
    },
    onError(err) {
      toast.error(err.message || "خطا در حذف پروژه");
    },
  });

  return (
    <div className="p-6 md:p-10 font-peyda-regular" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-peyda-bold text-foreground">مدیریت پروژه‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مجموع پروژه‌ها: {data?.total ?? 0}
          </p>
        </div>

        <Link
          href="/panel/projects/create"
          className="bg-primary text-white py-2.5 px-6 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          ایجاد پروژه جدید +
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-full sm:w-80">
          <ProductSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>

        {isFetching && (
          <span className="text-xs text-muted-foreground">در حال جستجو...</span>
        )}
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-muted-foreground">
          در حال بارگذاری پروژه‌ها...
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">تصویر اصلی</TableHead>
                  <TableHead className="text-right">نام پروژه</TableHead>
                  <TableHead className="text-right">Slug</TableHead>
                  <TableHead className="text-right">وضعیت انتشار</TableHead>
                  <TableHead className="text-right">تعداد تصاویر گالری</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.items?.length ? (
                  data.items.map((project) => {
                    const galleryCount = Array.isArray(project.images)
                      ? (project.images as string[]).length
                      : 0;

                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          {project.imageUrl ? (
                            <div className="relative h-[50px] w-[60px] overflow-hidden rounded-md border border-border">
                              <Image
                                src={project.imageUrl}
                                alt={project.translations?.[0]?.name ?? project.slug}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-[50px] w-[60px] rounded-md bg-muted" />
                          )}
                        </TableCell>

                        <TableCell className="font-medium">
                          {project.translations?.[0]?.name || "بدون عنوان"}
                        </TableCell>

                        <TableCell dir="ltr" className="text-right text-xs text-muted-foreground">
                          {project.slug}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              project.published
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {project.published ? "منتشر شده" : "پیش‌نویس"}
                          </span>
                        </TableCell>

                        <TableCell>{galleryCount} تصویر</TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              href={`/panel/projects/${project.id}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              ویرایش
                            </Link>

                            <span className="text-border">|</span>

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `آیا از حذف پروژه "${project.translations?.[0]?.name ?? project.slug}" اطمینان دارید؟`,
                                  )
                                ) {
                                  deleteMutation.mutate({
                                    id: project.id,
                                  });
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="text-destructive hover:underline text-sm font-medium disabled:opacity-50"
                            >
                              {deleteMutation.isPending ? "در حال حذف..." : "حذف"}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      هیچ پروژه‌ای یافت نشد.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 0}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
