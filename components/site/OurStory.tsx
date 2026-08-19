"use client";

import { getMessages } from "@/messages";
import React from "react";
import Image from "next/image";
import OurStoryImage from "../../public/images/ourStory.png";
import Outlook from "../../public/images/Outlook.png";
import { Button } from "../ui";
import { useRouter } from "next/navigation";
import SectionBorderTitle from "./SectionBorderTitle";

function OurStory({ locale }: { locale: string }) {
  const t = getMessages(locale);
  const router = useRouter();

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch lg:mx-40 md:mx-10 mx-5">
        <div className="relative w-full h-full min-h-[300px]">
          {" "}
          <Image
            src={OurStoryImage}
            alt="Our Story"
            fill
            className="object-cover "
          />
        </div>

        <div className="flex flex-col justify-center h-full">
          <div className="lg:px-10">
            <SectionBorderTitle>درباره ما</SectionBorderTitle>{" "}
            <p className="font-peyda-regular text-justify mt-5">
              {t.hero.ourStoryDescription}
            </p>
            <div className="text-left">
              <Button
                onClick={() => router.push(`/${locale}/contact`)}
                className="px-14 mt-10"
              >
                {t.contactus}
              </Button>
            </div>
          </div>

          <Image
            src={Outlook}
            alt="Outlook"
            width={500}
            className="mt-5 md:mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default OurStory;
