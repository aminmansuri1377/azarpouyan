// server/routers/category.ts یا یک فایل مشترک lib/category-tree.ts

export async function collectIdsInSubtree(
  prisma: any,
  rootId: string,
): Promise<string[]> {
  const all = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });

  const result = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of all) {
      if (c.parentId && result.has(c.parentId) && !result.has(c.id)) {
        result.add(c.id);
        changed = true;
      }
    }
  }
  return Array.from(result);
}
