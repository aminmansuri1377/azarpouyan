import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../init";

// تبدیل لیست flat به درخت تو در تو
function buildTree(flat: any[], parentId: string | null = null): any[] {
  return flat
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      ...c,
      children: buildTree(flat, c.id),
    }));
}

// جمع‌آوری تمام id های زیرمجموعه‌ی یک نود (برای جلوگیری از parent-loop)
async function collectDescendantIds(
  prisma: any,
  rootId: string,
): Promise<Set<string>> {
  const all = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });
  const result = new Set<string>();
  const stack = [rootId];
  while (stack.length) {
    const current = stack.pop()!;
    for (const c of all) {
      if (c.parentId === current && !result.has(c.id)) {
        result.add(c.id);
        stack.push(c.id);
      }
    }
  }
  return result;
}

export const categoryRouter = router({
  // لیست flat (برای select ها، breadcrumb و غیره)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });
  }),

  // درخت کامل و تو در تو (برای پنل مدیریت)
  getTree: publicProcedure.query(async ({ ctx }) => {
    const flat = await ctx.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });
    return buildTree(flat, null);
  }),

  // فرزندان مستقیم یک نود (برای لود تنبل/lazy در صورت نیاز)
  getChildren: publicProcedure
    .input(z.object({ parentId: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findMany({
        where: { parentId: input.parentId },
        orderBy: { sortOrder: "asc" },
        include: { translations: true },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.id },
        include: { translations: true },
      });
    }),

  // مسیر breadcrumb از ریشه تا نود فعلی (برای نمایش در فرم محصول)
  getPath: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const path: any[] = [];
      let currentId: string | null = input.id;
      while (currentId) {
        const node = await ctx.prisma.category.findUnique({
          where: { id: currentId },
          include: { translations: true },
        });
        if (!node) break;
        path.unshift(node);
        currentId = node.parentId;
      }
      return path;
    }),

  create: publicProcedure
    .input(
      z.object({
        parentId: z.string().nullable().optional(),
        slug: z.string(),
        imageUrl: z.string(),
        published: z.boolean().default(true),
        sortOrder: z.number().default(0),
        translations: z.array(
          z.object({
            languageId: z.string(),
            name: z.string(),
            slug: z.string(),
            seoTitle: z.string().optional(),
            seoDescription: z.string().optional(),
            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          parentId: input.parentId ?? null,
          slug: input.slug,
          imageUrl: input.imageUrl,
          published: input.published,
          sortOrder: input.sortOrder,
          translations: { create: input.translations },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        parentId: z.string().nullable().optional(),
        slug: z.string(),
        imageUrl: z.string(),
        published: z.boolean(),
        sortOrder: z.number().optional(),
        translations: z.array(
          z.object({
            languageId: z.string(),
            name: z.string(),
            slug: z.string(),
            seoTitle: z.string().optional(),
            seoDescription: z.string().optional(),
            seoKeywords: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, translations, parentId, ...rest } = input;

      // جلوگیری از حلقه: نمی‌شه parent یک نود، خودش یا یکی از نوادگانش باشه
      if (parentId) {
        if (parentId === id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "یک کتگوری نمی‌تواند فرزند خودش باشد",
          });
        }
        const descendants = await collectDescendantIds(ctx.prisma, id);
        if (descendants.has(parentId)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "نمی‌توان یک زیرشاخه را به‌عنوان والد انتخاب کرد",
          });
        }
      }

      await ctx.prisma.category.update({
        where: { id },
        data: { ...rest, parentId: parentId ?? null },
      });

      for (const translation of translations) {
        await ctx.prisma.categoryTranslation.upsert({
          where: {
            categoryId_languageId: {
              categoryId: id,
              languageId: translation.languageId,
            },
          },
          update: translation,
          create: { categoryId: id, ...translation },
        });
      }

      return true;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.delete({ where: { id: input.id } });
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "این کتگوری (یا یکی از زیرشاخه‌هایش) دارای محصول است و قابل حذف نیست.",
        });
      }
    }),
});
