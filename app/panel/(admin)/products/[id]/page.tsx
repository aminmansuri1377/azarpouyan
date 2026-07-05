"use client";

import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ProductForm } from "../../../../../components/product/ProductForm";
import type { ProductFormValues } from "@/types/product";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.product.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate();
      await utils.product.getById.invalidate({ id });
      router.push("/panel/products");
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    updateMutation.mutate({
      id,
      ...values,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  // تبدیل data به فرمت ProductFormValues
  const defaultValues: ProductFormValues | undefined = data
    ? {
        slug: data.slug,
        imageUrl: data.imageUrl,
        images: Array.isArray(data.images) ? (data.images as string[]) : [],
        categoryId: data.categoryId,
        published: data.published,
        translations: data.translations.map((t) => ({
          languageId: t.languageId,
          slug: t.slug,
          name: t.name,
          description: t.description,
          specifications: t.specifications,
          seoTitle: t.seoTitle ?? "",
          seoDescription: t.seoDescription ?? "",
          seoKeywords: t.seoKeywords ?? "",
        })),
      }
    : undefined;

  return (
    <>
      <h1>Edit Product</h1>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </>
  );
}
