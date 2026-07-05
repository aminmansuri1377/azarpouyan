"use client";

import { useEffect, useState } from "react";

type FlatCategory = {
  id: string;
  parentId: string | null;
  translations: { name: string }[];
};

function labelOf(c: FlatCategory) {
  return c.translations?.[0]?.name ?? c.id;
}

function findPath(all: FlatCategory[], id: string): string[] {
  const path: string[] = [];
  let current = all.find((c) => c.id === id);
  while (current) {
    path.unshift(current.id);
    const parentId: string | null = current.parentId;
    current = parentId ? all.find((c) => c.id === parentId) : undefined;
  }
  return path;
}

export function CategoryFilterCascade({
  categories,
  value,
  onChange,
}: {
  categories: FlatCategory[];
  value: string | undefined;
  onChange: (id: string | undefined) => void;
}) {
  const [chain, setChain] = useState<string[]>(() =>
    value ? findPath(categories, value) : [],
  );

  useEffect(() => {
    if (!categories.length) return;
    const path = value ? findPath(categories, value) : [];
    setChain((prev) => (prev.join(">") === path.join(">") ? prev : path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, categories.length]);

  const roots = categories.filter((c) => c.parentId === null);

  const levels: { key: string; options: FlatCategory[] }[] = [
    { key: "root", options: roots },
  ];
  for (let i = 0; i < chain.length; i++) {
    const selectedId = chain[i];
    const children = categories.filter((c) => c.parentId === selectedId);
    if (children.length > 0) {
      levels.push({ key: selectedId, options: children });
    }
  }

  const handleSelect = (levelIndex: number, id: string) => {
    if (!id) {
      const newChain = chain.slice(0, levelIndex);
      setChain(newChain);
      onChange(newChain[newChain.length - 1] ?? undefined);
      return;
    }
    const newChain = [...chain.slice(0, levelIndex), id];
    setChain(newChain);
    onChange(id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {levels.map((level, idx) => (
        <select
          key={level.key}
          value={chain[idx] ?? ""}
          onChange={(e) => handleSelect(idx, e.target.value)}
        >
          <option value="">
            {idx === 0 ? "همه کتگوری‌ها" : "همه زیرشاخه‌ها"}
          </option>
          {level.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {labelOf(opt)}
            </option>
          ))}
        </select>
      ))}

      {chain.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setChain([]);
            onChange(undefined);
          }}
        >
          پاک کردن فیلتر
        </button>
      )}
    </div>
  );
}
