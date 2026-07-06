"use client";

import Link from "next/link";

import { trpc } from "@/lib/trpc/client";

export default function ContactRequestsPage() {
  const { data, isLoading } = trpc.contactRequest.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Contact Requests</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Read</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td>{item.fullName}</td>

              <td>{item.subject}</td>

              <td>{item.isRead ? "Read" : "Unread"}</td>

              <td>
                <Link href={`/panel/contact-requests/${item.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
