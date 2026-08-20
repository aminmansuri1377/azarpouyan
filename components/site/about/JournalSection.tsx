// components/site/about/JournalSection.tsx
import JournalImage from "@/public/images/project2.png";
import DotPattern from "../DotPattern";
import SectionBorderTitle from "../SectionBorderTitle";
import JournalCard from "./JournalCard";

interface JournalSectionProps {
  description: string;
}

export default function JournalSection({ description }: JournalSectionProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 px-4 py-14 md:px-12 md:py-20 lg:px-20">
      <DotPattern />

      <div className="relative z-10 mx-auto max-w-7xl" dir="rtl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBorderTitle className="text-white">
              آخرین گاهنامه آذر پویان
            </SectionBorderTitle>
          </div>

          <p className="mx-auto mt-2 max-w-3xl font-peyda-regular text-xs leading-loose text-white/60 md:text-sm lg:text-base">
            {description}
          </p>
          <div className="mt-10 rounded-2xl bg-white/5 p-6 md:mt-14 md:rounded-3xl md:p-12">
            <JournalCard
              image={JournalImage}
              heading="گاهنامه آذرپویان شماره ۰۰۱"
              title="گاهنامه آذرپویان"
              description={description}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
