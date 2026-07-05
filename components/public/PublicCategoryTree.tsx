"use client";

import Link from "next/link";
import { useState } from "react";

type Node = {
  id: string;
  children: Node[];
  translations: {
    name: string;
    slug: string;
  }[];
};

export function PublicCategoryTree({
  locale,
  categories,
}: {
  locale: string;
  categories: Node[];
}) {
  return (
    <div>
      {categories.map((node) => (
        <CategoryNode key={node.id} node={node} locale={locale} />
      ))}
    </div>
  );
}

function CategoryNode({ node, locale }: { node: Node; locale: string }) {
  const [open, setOpen] = useState(false);

  const t = node.translations[0];

  return (
    <div
      style={{
        marginLeft: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {node.children.length > 0 && (
          <button onClick={() => setOpen((v) => !v)}>{open ? "-" : "+"}</button>
        )}

        <Link href={`/${locale}/category/${t.slug}`}>{t.name}</Link>
      </div>

      {open &&
        node.children.map((child) => (
          <CategoryNode key={child.id} node={child} locale={locale} />
        ))}
    </div>
  );
}
