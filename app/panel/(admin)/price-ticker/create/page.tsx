"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { PriceTickerForm } from "@/components/priceTicker/PriceTickerForm";
import type { PriceTickerFormValues } from "@/types/priceTicker";

export default function CreatePriceTickerPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: languages = [] } = trpc.language.getAll.useQuery();

  const createMutation = trpc.priceTicker.create.useMutation({
    onSuccess: async () => {
      await utils.priceTicker.getAll.invalidate();
      router.push("/panel/price-ticker");
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
