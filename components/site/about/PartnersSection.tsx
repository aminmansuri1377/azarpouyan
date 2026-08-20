// components/site/about/PartnersSection.tsx
import PartnerImage from "@/public/images/collabration.png";
import SectionBorderTitle from "../SectionBorderTitle";
import PartnerCard from "./PartnerCard";

interface Partner {
  title: string;
  description: string;
}

interface PartnersSectionProps {
  description: string;
  partners?: Partner[];
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    title: "مبلمان آوات",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. این متن برای پیش‌نمایش استفاده می‌شود و هدف آن معرفی همکاری میان دو مجموعه است.",
  },
  {
    title: "مبلمان آوات",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. این متن برای پیش‌نمایش استفاده می‌شود و هدف آن معرفی همکاری میان دو مجموعه است.",
  },
];

export default function PartnersSection({
  description,
  partners = DEFAULT_PARTNERS,
}: PartnersSectionProps) {
  return (
    <section className="px-4 py-10 md:px-12 md:py-16 lg:px-20" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBorderTitle className="text-foreground">
              شرکت هایی که با پویان همکاری دارند
            </SectionBorderTitle>
          </div>

          <p className="mx-auto mt-2 max-w-3xl font-peyda-regular text-xs leading-loose text-foreground/70 md:text-sm lg:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:gap-8">
          {partners.map((partner, index) => (
            <PartnerCard
              key={`${partner.title}-${index}`}
              image={PartnerImage}
              title={partner.title}
              description={partner.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
