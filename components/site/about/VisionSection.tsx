// components/site/about/VisionSection.tsx
import Image from "next/image";
import VisionImage from "@/public/images/project1.png";
import SectionBorderTitle from "../SectionBorderTitle";

interface VisionSectionProps {
  tagline: string;
  description: string;
}

export default function VisionSection({
  tagline,
  description,
}: VisionSectionProps) {
  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:px-16" dir="rtl">
      <div className="mx-auto max-w-7xl">
        {/* عنوان و توضیحات بالایی */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center">
            <SectionBorderTitle className="text-foreground">
              چشم انداز بناگستر آذر پویان
            </SectionBorderTitle>
          </div>

          <p className="mx-auto mt-4 max-w-3xl font-peyda-regular text-sm leading-loose text-foreground/70 md:text-base">
            {description}
          </p>
        </div>

        {/* کانتینر اصلی - دو ستونه */}
        <div className="relative mt-20 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* سمت راست - پنل متنی شش‌ضلعی */}
            <div className="relative -mt-20 lg:mt-0 z-10 my-10 md:my-0 ">
              <div
                className="relative py-10 px-6 sm:py-12 sm:px-8 md:px-10 lg:px-12"
                style={{
                  clipPath:
                    "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
                  backgroundColor: "#F6DEA3",
                }}
              >
                {/* محتوا داخل پنل */}
                <div className="text-right pr-4 sm:pr-6">
                  <h3 className="font-peyda-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-foreground">
                    هر خانه، نقطه آغاز یک داستان است
                  </h3>

                  <h4 className="font-peyda-bold text-lg sm:text-xl lg:text-2xl mt-3 sm:mt-4 leading-relaxed text-foreground/90">
                    داستان آرامش، امنیت، رشد و آینده
                  </h4>

                  <p className="mt-6 sm:mt-8 text-justify font-peyda-regular text-xs sm:text-sm md:text-base leading-loose text-foreground/80 lg:leading-8">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] xl:h-[600px] lg:-mr-16 xl:-mr-24">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={VisionImage}
                  alt="پروژه مسکونی آذر پویان"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />

                {/* کادر تزئینی سفید */}
                <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
