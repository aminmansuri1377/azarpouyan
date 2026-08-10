"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ProductForm } from "../../../../../components/product/ProductForm";
import type { ProductFormValues } from "@/types/product";

export default function CreateProductPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createMutation = trpc.product.create.useMutation({
    onSuccess: async () => {
      toast.success("محصول با موفقیت ایجاد شد");

      await utils.product.getAll.invalidate();

      router.push("/panel/products");
    },

    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className=" font-peyda-regular text-right">
      <h1>ساخت محصول</h1>
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
