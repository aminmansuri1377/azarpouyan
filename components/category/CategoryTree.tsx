"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

type TreeNode = {
  id: string;
  slug: string;
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
    onSuccess: onDeleted,
  });

  const hasChildren = node.children.length > 0;

  return (
    <div style={{ marginInlineStart: depth * 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid #eee",
        }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded((e) => !e)}>
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span style={{ width: 20, display: "inline-block" }} />
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
          onClick={() => {
            if (confirm("این کتگوری و همه زیرشاخه‌هایش حذف شوند؟")) {
              deleteMutation.mutate({ id: node.id });
            }
          }}
        >
          حذف
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
  const { data: tree = [], refetch } = trpc.category.getTree.useQuery();

  return (
    <div>
      <Link href="/panel/categories/create">+ کتگوری اصلی جدید</Link>
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
