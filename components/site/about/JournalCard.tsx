// components/site/about/JournalCard.tsx
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui";

interface JournalCardProps {
  image: StaticImageData;
  heading: string;
  title: string;
  description: string;
  ctaLabel?: string;
  href?: string;
}

export default function JournalCard({
  image,
  heading,
  title,
  description,
  ctaLabel = "دانلود گاهنامه",
  href = "#",
}: JournalCardProps) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10"
    >
      <div className="relative">
        {/* Decorative corner brackets */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:aspect-[16/10] md:rounded-2xl">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <span className="pointer-events-none absolute -right-2 -top-2 hidden h-10 w-10 border-e-2 border-t-2 border-primary md:block" />
        <span className="pointer-events-none absolute -bottom-2 -left-2 hidden h-10 w-10 border-b-2 border-s-2 border-primary md:block" />
      </div>
      <div>
        <h3 className="font-peyda-bold text-lg text-white sm:text-xl md:text-2xl">
          {heading}
        </h3>

        <p className="mt-4 text-justify font-peyda-regular text-xs leading-loose text-white/70 sm:text-sm md:mt-6 md:text-base md:leading-8">
          {description}
        </p>

        <Button asChild className="mt-6 px-10 font-peyda-bold md:mt-8">
          <a href={href}>{ctaLabel}</a>
        </Button>
      </div>
    </div>
  );
}
