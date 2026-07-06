"use client";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { PriceTickerForm } from "@/components/priceTicker/PriceTickerForm";
import type { PriceTickerFormValues } from "@/types/priceTicker";

export default function EditPriceTickerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.priceTicker.getById.useQuery(
    { id },
    { enabled: !!id },
  );
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const updateMutation = trpc.priceTicker.update.useMutation({
    onSuccess: async () => {
      toast.success("قیمت لحظه‌ای بروزرسانی شد");

      await utils.priceTicker.getAll.invalidate();

      await utils.priceTicker.getById.invalidate({
        id,
      });
      if (!id) {
        return <div>شناسه نامعتبر است</div>;
      }

      if (isLoading) {
        return <div>در حال بارگذاری...</div>;
      }

      if (!data) {
        return <div>قیمت لحظه‌ای پیدا نشد</div>;
      }
      router.push("/panel/price-ticker");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const defaultValues = useMemo<PriceTickerFormValues | undefined>(() => {
    if (!data) return undefined;
    return {
      active: data.active,
      imageUrl: data.imageUrl ?? "",
      sortOrder: data.sortOrder,
      translations: data.translations.map((t) => ({
        languageId: t.languageId,
        productName: t.productName,
        price: t.price,
      })),
    };
  }, [data]);

  const handleSubmit = (values: PriceTickerFormValues) => {
    updateMutation.mutate({ id, ...values });
  };

  if (!id) return <div>Invalid ID</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Edit Price Ticker</h1>
      <PriceTickerForm
        key={data?.id}
        defaultValues={defaultValues}
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update"
      />
    </>
  );
}
