import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

interface ServiceBannerProps {
  title: string;
  description: string;
  image: string | StaticImageData;

  primaryButton: string;
  secondaryButton?: string;

  className?: string;
}

export function ServiceBanner({
  title,
  description,
  image,
  primaryButton,
  secondaryButton,
  className,
}: ServiceBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl h-[340px] lg:mx-40 mx-5 my-8",
        className,
      )}
    >
      {/* Background */}
      <Image src={image} alt={title} fill priority className="object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 via-slate-900/55 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center gap-5 px-10 text-white">
        <h2 className="font-peyda-bold text-3xl">{title}</h2>

        <p className="font-peyda-regular leading-8 text-white/80">
          {description}
        </p>

        <div className="md:flex text-center items-center gap-4">
          <Button size="lg" className="px-10">
            {primaryButton}
          </Button>

          {secondaryButton && (
            <Button size="lg" variant="secondary" className="mt-5 md:mt-0">
              {secondaryButton}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
