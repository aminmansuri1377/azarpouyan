"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { trpc } from "@/lib/trpc/client";
import { CONTENT_TYPE_LABEL, type ContentType } from "@/types/content";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/Table";

interface ContentListPageProps {
  type: ContentType;
  basePath: string;
}

export function ContentListPage({ type, basePath }: ContentListPageProps) {
  const utils = trpc.useUtils();

  const { data, isLoading, error, refetch } = trpc.content.getAll.useQuery(
    { type },
    {
      retry: false,
    },
  );

  const deleteMutation = trpc.content.delete.useMutation({
    onSuccess: async () => {
      toast.success("محتوا با موفقیت حذف شد");

      await utils.content.getAll.invalidate({
        type,
      });
    },

    onError: (error) => {
      toast.error(error.message || "خطا در حذف محتوا");
    },
  });

  if (isLoading) {
    return <div style={{ padding: 20 }}>در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>خطا در دریافت محتواها</h2>

        <p style={{ color: "red" }}>{error.message}</p>

        <button onClick={() => refetch()}>تلاش مجدد</button>
      </div>
    );
  }

  return (
    <div className=" p-20 font-peyda-regular">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>{CONTENT_TYPE_LABEL[type]}s</h1>

        <Link
          href={`${basePath}/create`}
          className=" bg-primary py-2 px-8 m-4 rounded-2xl"
        >
          ایجاد {CONTENT_TYPE_LABEL[type]}
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاور</TableHead>
              <TableHead>عنوان</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>تاریخ انتشار</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.coverImage ? (
                      <div className="relative h-[50px] w-[50px]">
                        <Image
                          src={item.coverImage}
                          alt={item.translations?.[0]?.title ?? item.slug}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-[50px] w-[50px] rounded bg-muted" />
                    )}
                  </TableCell>

                  <TableCell>{item.translations?.[0]?.title ?? "-"}</TableCell>

                  <TableCell>{item.slug}</TableCell>

                  <TableCell>{item.published ? "Yes" : "No"}</TableCell>

                  <TableCell>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${basePath}/${item.id}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>

                      <span className="text-muted-foreground">|</span>

                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm(`حذف ${CONTENT_TYPE_LABEL[type]} ؟`)) {
                            deleteMutation.mutate({
                              id: item.id,
                            });
                          }
                        }}
                        className="text-destructive hover:underline disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "..." : "Delete"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  هیچ محتوایی یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
