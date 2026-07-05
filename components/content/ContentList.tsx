"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { ContentType, CONTENT_TYPE_LABEL } from "@/types/content";

interface ContentListPageProps {
  type: ContentType;
  basePath: string; // e.g. "/panel/articles"
}

export function ContentListPage({ type, basePath }: ContentListPageProps) {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.content.getAll.useQuery({ type });

  const deleteMutation = trpc.content.delete.useMutation({
    onSuccess: async () => {
      await utils.content.getAll.invalidate({ type });
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
        <h1>{CONTENT_TYPE_LABEL[type]}s</h1>
        <Link href={`${basePath}/create`}>
          Create {CONTENT_TYPE_LABEL[type]}
        </Link>
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Published</th>
            <th>Published At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
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
                  onClick={() => {
                    if (confirm(`Delete this ${CONTENT_TYPE_LABEL[type]}?`)) {
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
