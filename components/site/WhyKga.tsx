import { getMessages } from "@/messages";
import React from "react";

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
    <div className="pb-16">
      <h1 className="mx-auto my-5 text-center font-peyda-bold lg:text-2xl">
        {t.whyKgaTitle}
      </h1>
      <p className="mx-5 text-center font-peyda-regular md:mx-auto md:w-[50%]">
        {t.whyKgaDescription}
      </p>

      <div className="mx-5 mt-12 grid max-w-[1000px] gap-6 md:mx-auto md:grid-cols-3">
        {VALUES.map((value) => (
          <div
            key={value.id}
            className="rounded-2xl border border-primary px-8 py-5 md:py-10 md:text-center"
          >
            <h3 className="mb-4 font-peyda-medium text-2xl text-foreground">
              {value.title}
            </h3>
            <p className="font-peyda-thin text-sm text-foreground md:leading-[2]">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyKga;
