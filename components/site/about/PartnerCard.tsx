// components/site/about/PartnerCard.tsx
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui";

interface PartnerCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  ctaLabel?: string;
  href?: string;
}

export default function PartnerCard({
  image,
  title,
  description,
  ctaLabel = "دانلود کاتالوگ",
  href = "#",
}: PartnerCardProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-border bg-background p-5 sm:p-6 md:grid-cols-2 md:gap-10 md:rounded-3xl md:p-8">
      <div className="relative order-1 aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted md:order-2 md:rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="order-2 md:order-1">
        <h3 className="font-peyda-bold text-base text-foreground sm:text-lg md:text-xl">
          {title}
        </h3>

        <p className="mt-3 text-justify font-peyda-regular text-xs leading-loose text-foreground/70 md:mt-4 md:text-sm md:leading-8">
          {description}
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-5 px-8 font-peyda-bold md:mt-6"
        >
          <a href={href}>{ctaLabel}</a>
        </Button>
      </div>
    </div>
  );
}
