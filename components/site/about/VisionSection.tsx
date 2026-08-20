// components/site/about/VisionSection.tsx
import Image from "next/image";
import VisionImage from "@/public/images/project1.png";
import SectionBorderTitle from "../SectionBorderTitle";

interface VisionSectionProps {
  tagline: string;
  description: string;
}

// Flag-shaped panel: a rectangle whose left edge is pulled into a single
// point (like a bookmark/pennant), so the point pokes into the photo.
// Coordinates are percentages of the panel's own box.
const PANEL_CLIP_PATH =
  "polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 10% 64%, 0% 50%, 10% 36%)";

export default function VisionSection({
  tagline,
  description,
}: VisionSectionProps) {
  return (
    <section className="px-4 py-10 md:px-12 md:py-16 lg:px-20" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBorderTitle className="text-foreground">
              چشم انداز بناگستر آذر پویان
            </SectionBorderTitle>
          </div>

          <p className="mx-auto mt-2 max-w-4xl font-peyda-regular text-xs leading-loose text-foreground/70 md:text-sm lg:text-base">
            {description}
          </p>
        </div>

        <div className="relative mt-10 md:mt-14">
          {/* Full, uncropped photo */}
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[2/1] ">
            <Image
              src={VisionImage}
              alt="پروژه مسکونی آذر پویان"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />

            {/* Decorative inset frame */}
            <div className="pointer-events-none absolute inset-4 hidden border border-white/60 sm:block md:inset-6" />
          </div>

          {/* Flag-shaped text panel, overlapping the photo — desktop only */}
          <div
            className="pointer-events-none absolute inset-y-0 left-[34%] hidden w-[66%] items-center bg-primary/90 py-10 pe-10 ps-16 lg:flex xl:pe-14 xl:ps-24"
            style={{ clipPath: PANEL_CLIP_PATH }}
          >
            <div className="pointer-events-auto max-w-xl">
              <h3 className="font-peyda-bold text-2xl leading-relaxed text-foreground xl:text-3xl">
                {tagline}
              </h3>

              <p className="mt-5 text-justify font-peyda-regular text-xs leading-loose text-foreground/80 xl:text-sm xl:leading-8">
                {description}
              </p>
            </div>
          </div>

          {/* Compact overlay panel — mobile/tablet */}
          <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-background/95 p-5 sm:p-8 lg:hidden">
            <h3 className="font-peyda-bold text-base leading-relaxed text-foreground sm:text-xl">
              {tagline}
            </h3>

            <p className="mt-3 text-justify font-peyda-regular text-xs leading-loose text-foreground/80 sm:text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
