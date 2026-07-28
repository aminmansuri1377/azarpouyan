import { getMessages } from "@/messages";
import React from "react";
import Image from "next/image";
import OurStoryImage from "../../public/images/ourStory.png";
import { Button } from "../ui";
function OurStory({ locale }: { locale: string }) {
  const t = getMessages(locale);

  return (
    <div className="m-20">
      <div className="grid grid-cols-1 gap-40 md:grid-cols-2">
        <div className="m-20">
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
