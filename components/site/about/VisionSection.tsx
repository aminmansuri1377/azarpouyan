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

        {/* کانتینر اصلی */}
        <div className="relative mt-8 md:mt-12">
          {/* عکس - full width */}
          <div className="relative aspect-[4/3] lg:aspect-[2/1] w-full overflow-hidden">
            <Image
              src={VisionImage}
              alt="پروژه مسکونی آذر پویان"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />

            {/* کادر تزئینی سفید */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 border-2 border-white/70 " />
          </div>

          {/* نسخه موبایل - پنل کامل در پایین عکس */}
          <div className="lg:hidden relative mt-6 mx-2">
            <div
              className="relative py-6 px-5  shadow-lg"
              style={{
                backgroundColor: "#EDE6D4",
              }}
            >
              <div className="text-right">
                <h3 className="font-peyda-bold text-lg leading-relaxed text-foreground">
                  هر خانه، نقطه آغاز یک داستان است
                </h3>

                <h4 className="font-peyda-bold text-base mt-2 leading-relaxed text-foreground/90">
                  داستان آرامش، امنیت، رشد و آینده
                </h4>

                <p className="mt-4 text-justify font-peyda-regular text-xs leading-loose text-foreground/80">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* نسخه دسکتاپ - باکس متنی شش‌ضلعی - در وسط عکس */}
          <div className="hidden lg:block absolute top-1/2 left-2/2 -translate-x-2/2 -translate-y-1/2 z-10 w-[85%] md:w-[70%]">
            <div
              className="relative py-8 px-6 sm:py-10 sm:px-8 md:py-12 md:px-10 lg:px-12"
              style={{
                clipPath:
                  "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
                backgroundColor: "#EDE6D4",
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

                <p className="mt-6 ml-10 sm:mt-8 text-justify font-peyda-regular text-xs sm:text-sm md:text-base leading-loose text-foreground/80 lg:leading-8">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
