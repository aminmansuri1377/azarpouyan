import Image from "next/image";

export type CommentCardData = {
  fullName: string;
  companyName: string | null;
  text: string;
  imageUrl: string;
};

export default function CommentCard({ comment }: { comment: CommentCardData }) {
  return (
    <figure
      dir="rtl"
      className="border border-slate-500 bg-card p-6 text-foreground"
    >
      <figcaption className="mb-5 flex items-center gap-3">
        <Image
          src={comment.imageUrl}
          alt={comment.fullName}
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="break-words font-peyda-bold">{comment.fullName}</p>
          {comment.companyName && (
            <p className="mt-1 break-words text-xs text-muted-foreground">
              {comment.companyName}
            </p>
          )}
        </div>
      </figcaption>
      <blockquote className="whitespace-pre-wrap break-words text-sm leading-8 text-muted-foreground">
        {comment.text}
      </blockquote>
    </figure>
  );
}
