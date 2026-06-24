"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

export default function ContactRequestPage() {
  const params = useParams();

  const id = params.id as string;

  const utils = trpc.useUtils();

  const { data } = trpc.contactRequest.getById.useQuery({
    id,
  });

  const markAsRead = trpc.contactRequest.markAsRead.useMutation({
    onSuccess() {
      utils.contactRequest.getAll.invalidate();
      utils.contactRequest.getById.invalidate({
        id,
      });
    },
  });

  useEffect(() => {
    if (data && !data.isRead) {
      markAsRead.mutate({
        id,
      });
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.fullName}</h1>

      <p>
        <b>Phone:</b> {data.phone}
      </p>

      <p>
        <b>Email:</b> {data.email}
      </p>

      <p>
        <b>Subject:</b> {data.subject}
      </p>

      <hr />

      <p>{data.message}</p>
    </div>
  );
}
