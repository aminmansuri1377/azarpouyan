import { getMessages } from "@/messages";
import React from "react";
import Image from "next/image";
import OurStoryImage from "../../public/images/ourStory.png";
import { Button } from "../ui";
function OurStory({ locale }: { locale: string }) {
  const t = getMessages(locale);

  return (
    <div className="my-20">
      <div className="flex justify-between lg:mx-40 md:mx-10 lg:gap-40 md:gap-10">
        <div className="w-[50%]">
          <h1 className=" font-peyda-bold my-5">{t.hero.ourStory}</h1>
          <p className=" font-peyda-regular text-justify">
            {t.hero.ourStoryDescription}
          </p>
          <Button className="px-14 mt-10">{t.contactus}</Button>
        </div>
        <Image src={OurStoryImage} alt="Our Story" width={400} height={200} />
      </div>
    </div>
  );
}

export default OurStory;
