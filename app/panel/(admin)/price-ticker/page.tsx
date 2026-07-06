"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import toast from "react-hot-toast";
import { useEffect } from "react";
export default function PriceTickerListPage() {
  const utils = trpc.useUtils();
  const { data, isLoading, error, refetch } =
    trpc.priceTicker.getAll.useQuery();

  const deleteMutation = trpc.priceTicker.delete.useMutation({
    onSuccess: async () => {
      toast.success("قیمت لحظه‌ای حذف شد");

      await utils.priceTicker.getAll.invalidate();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت کتگوری‌ها");
    }
  }, [error]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>Price Tickers</h1>
        <Link href="/panel/price-ticker/create">Create Ticker</Link>
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Sort Order</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.translations?.[0]?.productName ?? "-"}</td>
              <td>{item.translations?.[0]?.price ?? "-"}</td>
              <td>{item.sortOrder}</td>
              <td>{item.active ? "Yes" : "No"}</td>
              <td>
                <Link href={`/panel/price-ticker/${item.id}`}>Edit</Link>
                {" | "}
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (!confirm("Delete this ticker?")) return;

                    deleteMutation.mutate({
                      id: item.id,
                    });
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
