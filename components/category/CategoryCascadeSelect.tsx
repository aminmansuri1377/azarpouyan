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

// مسیر از ریشه تا نود انتخاب‌شده را برمی‌گرداند: [rootId, ..., selectedId]
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

export function CategoryCascadeSelect({
  categories,
  value,
  onChange,
}: {
  categories: FlatCategory[];
  value: string;
  onChange: (id: string) => void;
}) {
  // chain[i] = آیدی انتخاب‌شده در سطح i (۰ = ریشه)
  const [chain, setChain] = useState<string[]>(() =>
    value ? findPath(categories, value) : [],
  );

  // هماهنگ‌سازی وقتی defaultValues از بیرون (مثلاً حالت ویرایش) بعد از لود شدن categories می‌رسه
  useEffect(() => {
    if (!categories.length) return;
    const path = value ? findPath(categories, value) : [];
    setChain((prev) => (prev.join(">") === path.join(">") ? prev : path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, categories.length]);

  const roots = categories.filter((c) => c.parentId === null);

  // ساخت لیست سطوحی که باید نمایش داده بشن
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
      // پاک کردن این سطح: categoryId برمی‌گرده به آخرین سطح انتخاب‌شده‌ی قبلی
      const newChain = chain.slice(0, levelIndex);
      setChain(newChain);
      onChange(newChain[newChain.length - 1] ?? "");
      return;
    }
    const newChain = [...chain.slice(0, levelIndex), id];
    setChain(newChain);
    onChange(id);
  };

  return (
    <div className=" flex justify-end gap-5 ">
      {levels.map((level, idx) => (
        <select
          key={level.key}
          required={idx === 0}
          className="bg-primary px-6 py-1 rounded-2xl my-3"
          value={chain[idx] ?? ""}
          onChange={(e) => handleSelect(idx, e.target.value)}
        >
          <option value="">
            {idx === 0
              ? "انتخاب کتگوری اصلی (اجباری)"
              : "— بدون زیرشاخه (همینجا متوقف شو) —"}
          </option>
          {level.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {labelOf(opt)}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
