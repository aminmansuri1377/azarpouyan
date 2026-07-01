"use client";

type FlatCategory = {
  id: string;
  parentId: string | null;
  translations: { name: string }[];
};

function buildOptions(
  all: FlatCategory[],
  parentId: string | null = null,
  depth = 0,
): { id: string; label: string }[] {
  return all
    .filter((c) => c.parentId === parentId)
    .flatMap((c) => [
      {
        id: c.id,
        label: `${"— ".repeat(depth)}${c.translations?.[0]?.name ?? c.id}`,
      },
      ...buildOptions(all, c.id, depth + 1),
    ]);
}

export function CategoryTreeSelect({
  categories,
  value,
  onChange,
}: {
  categories: FlatCategory[];
  value: string;
  onChange: (id: string) => void;
}) {
  const options = buildOptions(categories);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required>
      <option value="">انتخاب کتگوری (اجباری)</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
