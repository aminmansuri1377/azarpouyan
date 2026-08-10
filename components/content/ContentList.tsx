"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { trpc } from "@/lib/trpc/client";
import { CONTENT_TYPE_LABEL, type ContentType } from "@/types/content";

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

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>کاور</th>
            <th>عنوان</th>
            <th>Slug</th>
            <th>Published</th>
            <th>تاریخ انتشار</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className=" mx-auto text-center">
          {data?.length ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.coverImage ? (
                    <div
                      style={{
                        position: "relative",
                        width: 50,
                        height: 50,
                      }}
                    >
                      <Image
                        src={item.coverImage}
                        alt={item.translations?.[0]?.title ?? item.slug}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </td>

                <td>{item.translations?.[0]?.title ?? "-"}</td>

                <td>{item.slug}</td>

                <td>{item.published ? "Yes" : "No"}</td>

                <td>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <Link href={`${basePath}/${item.id}`}>Edit</Link>

                  {" | "}

                  <button
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm(`حذف ${CONTENT_TYPE_LABEL[type]} ؟`)) {
                        deleteMutation.mutate({
                          id: item.id,
                        });
                      }
                    }}
                  >
                    {deleteMutation.isPending ? "..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: "center",
                  padding: 20,
                }}
              >
                هیچ محتوایی یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
