// components/site/about/AboutHero.tsx
import Image from "next/image";
import HeroImage from "@/public/images/office.jpg";

interface AboutHeroProps {
  label?: string;
  tagline: string;
  description: string;
}

export default function AboutHero({
  label = "درباره ما",
  tagline,
  description,
}: AboutHeroProps) {
  return (
    <section className="px-4 py-10 md:px-12 md:py-16 lg:px-20" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 font-peyda-bold text-lg text-foreground md:mb-10 md:text-xl">
          {label} :
        </h1>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-[4/3] w-full overflow-hidden  md:aspect-[3/2] md:order-2">
            <Image
              src={HeroImage}
              alt="جلسه کاری تیم آذر پویان"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
          </div>
          <div>
            <h2 className="font-peyda-bold text-xl leading-relaxed text-foreground md:text-2xl lg:text-3xl">
              {tagline}
            </h2>

            <p className="mt-5 text-justify font-peyda-regular text-xs leading-loose text-foreground/80 md:mt-6 md:text-sm md:leading-6 lg:text-sm">
              {description}
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
