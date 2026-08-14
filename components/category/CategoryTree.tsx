"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/cn";

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

function ActionLink({
  href,
  onClick,
  disabled,
  danger,
  children,
}: {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const classes = cn(
    "rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
    danger
      ? "text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}

function CategoryNode({
  node,
  onDeleted,
}: {
  node: TreeNode;
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
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-lg px-2 py-1.5",
          "hover:bg-muted/60",
        )}
      >
        {/* Expand / collapse toggle */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="h-6 w-6 shrink-0" />
        )}

        {/* Thumbnail */}
        {node.imageUrl ? (
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={node.imageUrl}
              alt={displayName(node)}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
            بی‌عکس
          </div>
        )}

        {/* Name + status */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={cn(
              "truncate text-sm font-medium",
              !node.published && "text-muted-foreground",
            )}
          >
            {displayName(node)}
          </span>

          {!node.published && (
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              پیش‌نویس
            </span>
          )}

          {hasChildren && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {node.children.length} زیرشاخه
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <ActionLink href={`/panel/categories/${node.id}`}>ویرایش</ActionLink>
          <ActionLink href={`/panel/products?categoryId=${node.id}`}>
            محصولات
          </ActionLink>
          <ActionLink href={`/panel/categories/create?parentId=${node.id}`}>
            + زیرشاخه
          </ActionLink>
          <ActionLink
            danger
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (confirm("این کتگوری و همه زیرشاخه‌هایش حذف شوند؟")) {
                deleteMutation.mutate({ id: node.id });
              }
            }}
          >
            {deleteMutation.isPending ? "..." : "حذف"}
          </ActionLink>
        </div>
      </div>

      {/* Children with a continuous indent guide */}
      {hasChildren && expanded && (
        <div className="ms-[27px] space-y-0.5 border-s border-border/70 ps-2">
          {node.children.map((child) => (
            <CategoryNode key={child.id} node={child} onDeleted={onDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-2 px-2">
          <div className="h-6 w-6 rounded-md bg-muted" />
          <div className="h-8 w-8 rounded-md bg-muted" />
          <div className="h-3 w-40 rounded bg-muted" />
        </div>
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

  return (
    <div className="font-peyda-regular">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">دسته‌بندی‌ها</h1>

        <Link
          href="/panel/categories/create"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          + کتگوری اصلی جدید
        </Link>
      </div>

      <div className="rounded-xl border border-border p-2">
        {isLoading ? (
          <TreeSkeleton />
        ) : tree.length ? (
          <div className="space-y-0.5">
            {tree.map((node: TreeNode) => (
              <CategoryNode key={node.id} node={node} onDeleted={refetch} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              هنوز هیچ کتگوری‌ای ثبت نشده
            </p>
            <Link
              href="/panel/categories/create"
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              ساخت اولین کتگوری
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
