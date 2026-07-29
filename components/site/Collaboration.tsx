"use client";

import { getMessages } from "@/messages";
import React from "react";
import { Button } from "../ui";
import Image from "next/image";
import CollaborationImage from "../../public/images/collabration.png";
import { useRouter } from "next/navigation";
function Collaboration({ locale }: { locale: string }) {
  const t = getMessages(locale);
  const router = useRouter();

  return (
    <div className="my-10 lg:mx-40 mx-10">
      <div className=" lg:flex justify-between rounded-3xl border border-primary px-8 ">
        <div className=" lg:w-[40%] py-10">
          <h2 className="lg:text-3xl font-peyda-bold mt-5 mb-16 text-justify">
            {t.collaborationDescription}
          </h2>
          <Button
            onClick={() => router.push(`/${locale}/contact`)}
            size="lg"
            className="px-16"
          >
            {t.startBusiness}
          </Button>
        </div>
        <Image src={CollaborationImage} alt="collaboration" width={400} />
      </div>
    </div>
  );
}

export default Collaboration;
