"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { PriceTickerForm } from "@/components/priceTicker/PriceTickerForm";
import type { PriceTickerFormValues } from "@/types/priceTicker";
import toast from "react-hot-toast";
export default function CreatePriceTickerPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const createMutation = trpc.priceTicker.create.useMutation({
    onSuccess: async () => {
      toast.success("قیمت لحظه‌ای با موفقیت ایجاد شد");

      await utils.priceTicker.getAll.invalidate();

      router.push("/panel/price-ticker");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: PriceTickerFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <>
      <h1 style={{ padding: "20px 20px 0" }}>Create Price Ticker</h1>
      <PriceTickerForm
        languages={languages}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create"
      />
    </>
  );
}
