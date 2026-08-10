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
        "relative overflow-hidden md:rounded-3xl rounded-2xl h-[80vh] md:h-[55vh] lg:mx-40 md:pb-20 mx-5 my-8",
        className,
      )}
    >
      {/* Background */}
      <Image src={image} alt={title} fill priority className="object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 via-slate-900/55 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center gap-5 md:px-10 px-5 text-white">
        <h2 className="font-peyda-bold md:text-3xl text-2xl">{title}</h2>

        <p className="font-peyda-regular md:leading-8 text-white/80">
          {description}
        </p>

        <div className="flex text-center items-center md:gap-4 gap-2 md:mt-10">
          <Button size="lg" className="md:px-10 px-5">
            {primaryButton}
          </Button>

          {secondaryButton && (
            <Button size="lg" variant="secondary" className="md:px-10 px-5">
              {secondaryButton}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
