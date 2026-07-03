export async function collectIdsInSubtreeFront(prisma: any, rootId: string) {
  const all = await prisma.category.findMany({
    select: {
      id: true,
      parentId: true,
    },
  });

  const ids = [rootId];

  const stack = [rootId];

  while (stack.length) {
    const current = stack.pop()!;

    for (const category of all) {
      if (category.parentId === current) {
        ids.push(category.id);
        stack.push(category.id);
      }
    }
  }

  return ids;
}
