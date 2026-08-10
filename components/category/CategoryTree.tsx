"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { trpc } from "@/lib/trpc/client";
import Image from "next/image";
type TreeNode = {
  id: string;
  slug: string;
  imageUrl: string;
  published: boolean;
  translations: { languageId: string; name: string }[];
  children: TreeNode[];
};

function displayName(node: TreeNode) {
  return node.translations[0]?.name ?? node.slug;
}

function CategoryNode({
  node,
  depth,
  onDeleted,
}: {
  node: TreeNode;
  depth: number;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      toast.success("کتگوری با موفقیت حذف شد");
      onDeleted();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const hasChildren = node.children.length > 0;

  return (
    <div className="  text-center mx-auto">
      <div
        style={{
          padding: "6px 0",
          borderBottom: "1px solid #eee",
        }}
        className=" font-peyda-regular flex justify-center gap-10"
      >
        {hasChildren ? (
          <button onClick={() => setExpanded((e) => !e)}>
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span style={{ width: 20, display: "inline-block" }} />
        )}

        {/* <span style={{ opacity: node.published ? 1 : 0.5 }}>
          {displayName(node)}
        </span> */}
        {hasChildren ? (
          <button onClick={() => setExpanded((e) => !e)}>
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span style={{ width: 20, display: "inline-block" }} />
        )}

        {node.imageUrl && (
          <Image
            src={node.imageUrl}
            alt={displayName(node)}
            width={50}
            height={50}
            style={{
              objectFit: "cover",
              borderRadius: 4,
              border: "1px solid #eee",
            }}
          />
        )}

        <span style={{ opacity: node.published ? 1 : 0.5 }}>
          {displayName(node)}
        </span>
        <Link href={`/panel/categories/${node.id}`}>ویرایش</Link>

        <Link href={`/panel/products?categoryId=${node.id}`}>
          مشاهده محصولات
        </Link>

        <Link href={`/panel/categories/create?parentId=${node.id}`}>
          + افزودن زیرشاخه
        </Link>

        <button
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (confirm("این کتگوری و همه زیرشاخه‌هایش حذف شوند؟")) {
              deleteMutation.mutate({
                id: node.id,
              });
            }
          }}
        >
          {deleteMutation.isPending ? "در حال حذف..." : "حذف"}
        </button>
      </div>

      {expanded &&
        node.children.map((child) => (
          <CategoryNode
            key={child.id}
            node={child}
            depth={depth + 1}
            onDeleted={onDeleted}
          />
        ))}
    </div>
  );
}

export function CategoryTree() {
  const {
    data: tree = [],
    refetch,
    error,
    isLoading,
  } = trpc.category.getTree.useQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className=" font-peyda-regular">
      <Link
        href="/panel/categories/create"
        className=" bg-primary py-2 px-6 rounded-2xl"
      >
        + کتگوری اصلی جدید
      </Link>

      <div style={{ marginTop: 16 }}>
        {tree.map((node: TreeNode) => (
          <CategoryNode
            key={node.id}
            node={node}
            depth={0}
            onDeleted={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
}
