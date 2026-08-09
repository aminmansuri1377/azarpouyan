import { getMessages } from "@/messages";
import React from "react";
import { id } from "zod/v4/locales";
import SectionTitle from "../ui/SectionTitle";
const VALUES = [
  {
    id: 1,
    title: "مورد اول",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    id: 2,
    title: "مورد دوم",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
  {
    id: 3,
    title: "مورد سوم",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  },
];
function WhyKga({ locale }: { locale: string }) {
  const t = getMessages(locale);

  return (
    <div>
      <SectionTitle>? WHY CHOOS US</SectionTitle>

      <h1 className=" text-center font-peyda-bold my-5 mx-auto lg:text-2xl">
        {t.whyKgaTitle}
      </h1>
      <p className="text-center font-peyda-regular md:w-[50%] mx-auto">
        {t.whyKgaDescription}
      </p>
      <div className="mx-auto mt-12 grid max-w-[1000px] gap-6 md:grid-cols-3">
        {VALUES.map((value) => (
          <div
            key={value.id}
            className="rounded-2xl border border-primary px-8 py-10 text-center"
          >
            <h3 className="mb-4 font-peyda-semibold text-2xl text-foreground font-peyda-medium">
              {value.title}
            </h3>
            <p className=" text-sm leading-[2] text-foreground font-peyda-thin">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyKga;
