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
        <div className=" lg:w-[50%] py-10">
          <p className="lg:text-3xl font-peyda-bold mt-5 mb-16 text-justify leading-12">
            {t.collaborationDescription}
          </p>
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
