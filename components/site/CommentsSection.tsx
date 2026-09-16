"use client";

import { trpc } from "@/lib/trpc/client";
import CommentCard from "@/components/comments/CommentCard";
import SectionBorderTitle from "./SectionBorderTitle";

export default function CommentsSection() {
  const { data: comments } = trpc.comment.getPublished.useQuery();
  if (!comments?.length) return null;

  return (
    <section
      dir="rtl"
      aria-labelledby="comments-title"
      className="bg-muted/40 py-16 font-peyda-medium"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 text-center">
          <SectionBorderTitle>
            <h2 id="comments-title">نظرات شما</h2>
          </SectionBorderTitle>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            دیدگاه شما، بخشی از مسیر ما برای ساختن تجربه‌ای بهتر است.
          </p>
        </div>
        <ul
          tabIndex={0}
          aria-label="نظرات؛ برای مشاهدهٔ بیشتر به طرفین اسکرول کنید"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 focus-visible:outline-2 focus-visible:outline-primary"
        >
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="[&>figure]:h-full w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <CommentCard comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
