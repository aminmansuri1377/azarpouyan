"use client";

import { getMessages } from "@/messages";
import React from "react";
import Image from "next/image";
import OurStoryImage from "../../public/images/manager.png";
import Outlook from "../../public/images/Outlook.png";
import { Button } from "../ui";
import { Reveal } from "../ui/Reveal";
import { useRouter } from "next/navigation";
import SectionBorderTitle from "./SectionBorderTitle";

function OurStory({ locale }: { locale: string }) {
  const t = getMessages(locale);
  const router = useRouter();

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch lg:mx-40 md:mx-10 mx-5">
        <Reveal
          delay={150}
          className="flex flex-col justify-center h-full md:order-2"
        >
          <div className="lg:px-10 text-center md:text-right">
            <SectionBorderTitle>درباره ما</SectionBorderTitle>{" "}
            <h1 className=" text-xl font-peyda-bold mt-8">
              {" "}
              توسعه‌ای که با کیفیت تعریف می‌شود
            </h1>
            <p className="font-peyda-regular text-justify mt-5">
              آذر پویان در مسیر توسعه پروژه‌های ساختمانی، کیفیت را از نخستین
              تصمیم‌های طراحی تا آخرین مراحل اجرا دنبال می‌کند. معماری هدفمند،
              مهندسی دقیق، نظارت تخصصی و توجه به جزئیات، ارکان اصلی پروژه‌هایی
              هستند که با نام آذر پویان شکل می‌گیرند.{" "}
            </p>
            <p className="font-peyda-regular text-justify mt-5">
              هر پروژه با شناخت نیازهای زندگی امروز، کیفیت فضاهای مسکونی،
              امکانات مورد نیاز ساکنان و الزامات بلندمدت یک مجموعه طراحی و توسعه
              می‌یابد؛ تا نتیجه، محیطی منسجم، کارآمد و ارزشمند برای زندگی
              باشد.{" "}
            </p>
            <p className="font-peyda-regular text-justify mt-5">
              همکاری با تیم‌های تخصصی، کنترل مستمر فرآیند اجرا و انتخاب
              راهکارهایی که دوام و کیفیت پروژه را تقویت می‌کنند، مسیر آذر پویان
              را در توسعه پروژه‌هایی شکل داده است که بتوانند در طول زمان، کیفیت
              و ارزش خود را حفظ کنند.{" "}
            </p>
            <div className="text-left">
              <Button
                onClick={() => router.push(`/${locale}/aboutUs`)}
                className="px-14 mt-10"
              >
                اطلاعات بیشتر
              </Button>
            </div>
          </div>
          {/* <Reveal delay={300}>
            <div className="relative animate-float">
              <Image
                src={Outlook}
                alt="Outlook"
                width={500}
                className="mt-5 md:mx-auto"
              />
              <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
            </div>
          </Reveal> */}
        </Reveal>
        <Reveal
          direction="right"
          className="relative w-full h-full min-h-[400px] md:order-1"
        >
          <Image
            src={OurStoryImage}
            alt="Our Story"
            fill
            className="object-cover "
          />
          <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
        </Reveal>
      </div>
    </div>
  );
}

export default OurStory;
