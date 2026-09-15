// components/site/about/JournalCard.tsx
import Image, { StaticImageData } from "next/image";
import JournalDownloadButton from "./JournalDownloadButton";

interface JournalCardProps {
  image: StaticImageData | string;
  heading: string;
  title: string;
  description: string;
  ctaLabel?: string;
  journalId: string;
}

export default function JournalCard({
  image,
  heading,
  title,
  description,
  ctaLabel = "دانلود گاهنامه",
  journalId,
}: JournalCardProps) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10"
    >
      <div className="relative">
        {/* Decorative corner brackets */}
        <div className="relative aspect-[4/3] w-full overflow-hidden  sm:aspect-[16/10] ">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
        </div>
        <span className="pointer-events-none absolute -right-2 -top-2 hidden h-10 w-10 border-e-2 border-t-2 border-primary md:block" />
        <span className="pointer-events-none absolute -bottom-2 -left-2 hidden h-10 w-10 border-b-2 border-s-2 border-primary md:block" />
      </div>
      <div>
        <h3 className="font-peyda-bold text-lg text-white sm:text-xl md:text-2xl">
          {heading}
        </h3>

        <p className="mt-4 whitespace-pre-line text-justify font-peyda-regular text-xs leading-loose text-white/70 sm:text-sm md:mt-6 md:text-base md:leading-8">
          {description}
        </p>

        <JournalDownloadButton
          id={journalId}
          label={ctaLabel}
          className="mt-6 px-10 font-peyda-bold md:mt-8"
        />
      </div>
    </div>
  );
}
