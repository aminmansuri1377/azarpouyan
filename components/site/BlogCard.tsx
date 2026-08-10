// components/site/BlogCard.tsx
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface BlogCardProps {
  image: StaticImageData | string;
  title: string;
  description: string;
  href?: string;
}

export function BlogCard({
  image,
  title,
  description,
  href = "#",
}: BlogCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-3xl bg-white shadow-sm overflow-hidden"
    >
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="px-5 py-4">
        <h3 className="font-peyda-bold text-lg text-foreground mb-2">
          {title}
        </h3>
        <p className="font-peyda-regular text-sm leading-[1.8] text-foreground/70 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
