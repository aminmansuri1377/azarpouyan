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
        "relative mx-5 my-8 h-[60vh] overflow-hidden rounded-2xl md:h-[55vh] md:rounded-3xl md:pb-20 lg:mx-40",
        className,
      )}
    >
      {/* Background */}
      <Image src={image} alt={title} fill priority className="object-cover" />

      {/* Mobile: bottom gradient / Desktop: original gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/55 to-transparent md:bg-gradient-to-l md:from-slate-950/80" />

      {/* Content */}
      <div
        className="
          relative z-10 flex h-full max-w-xl flex-col
          justify-end gap-5 px-5 pb-8 text-white
          md:justify-center md:px-10 md:pb-0
        "
      >
        <h2 className="font-peyda-bold text-2xl md:text-3xl">{title}</h2>

        <p className="font-peyda-regular text-white/80 md:leading-8">
          {description}
        </p>

        <div className="flex w-full items-center gap-2 text-center md:mt-10 md:gap-4">
          <Button size="lg" className="flex-1 px-5 md:flex-none md:px-10">
            {primaryButton}
          </Button>

          {secondaryButton && (
            <Button
              size="lg"
              variant="secondary"
              className="flex-1 px-5 md:flex-none md:px-10"
            >
              {secondaryButton}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
