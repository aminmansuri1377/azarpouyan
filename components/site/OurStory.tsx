"use client";

import { getMessages } from "@/messages";
import React from "react";
import Image from "next/image";
import OurStoryImage from "../../public/images/ourStory.png";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
function OurStory({ locale }: { locale: string }) {
  const t = getMessages(locale);
  const router = useRouter();

  return (
    <div className="my-20">
      <div className="lg:flex items-center justify-between lg:mx-40 md:mx-10 mx-5 lg:gap-40 md:gap-10">
        <div className="lg:w-[50%]">
          <h1 className="text-outline md:text-6xl text-left text-4xl">
            ABOUT US
          </h1>
          <h1 className=" text-3xl font-peyda-bold my-5">{t.hero.ourStory}</h1>
          <p className=" font-peyda-regular text-justify">
            {t.hero.ourStoryDescription}
          </p>
          <Button
            onClick={() => router.push(`/${locale}/contact`)}
            className="px-14 mt-10"
          >
            {t.contactus}
          </Button>
        </div>
        <Image
          src={OurStoryImage}
          alt="Our Story"
          width={400}
          height={200}
          className="mt-5"
        />
      </div>
    </div>
  );
}

export default OurStory;
