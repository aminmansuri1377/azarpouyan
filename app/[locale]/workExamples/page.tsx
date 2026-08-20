import ProjectsSection from "@/components/site/ProjectsSection";
import React from "react";
import Image from "next/image";
import Office from "../../../public/images/office.jpg";
function page() {
  return (
    <div className="mt-20 font-peyda-regular">
      <div className=" md:grid md:grid-cols-2 gap-24 items-cente p-5 md:p-20 items-center">
        <div className="relative w-full aspect-[1.5] overflow-hidden order-2">
          <Image
            src={Office}
            alt="Office"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-3 sm:inset-4 border-2 border-white/70" />
        </div>
        <div className="order-1 mt-5 md:mt-0">
          <h2>نمونه کار های ما :</h2>
          <h1 className=" font-bold my-10 md:my-20 text-2xl md:text-3xl">
            هر خــانه، نقطه آغــاز یــک داستـان اســت داستان آرامش، امنیت، رشد و
            آینده
          </h1>
          <p className=" text-justify">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی
            گرافیک است. طراحان گرافیک از این متن برای نمایش فرم و چیدمان محتوا
            استفاده می‌کنند. هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به
            محتوای واقعی است. و چیدمان محتوا استفاده می‌کنند. هدف از آن تمرکز بر
            ظاهر طراحی بدون وابستگی به محتوای واقعی است. لورم ایپسوم متن ساختگی
            با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. طراحان گرافیک
            از این متن برای نمایش فرم و چیدمان محتوا استفاده می‌کنند. هدف از آن
            تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی است. و چیدمان محتوا
            استفاده می‌کنند. هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به
            محتوای واقعی است.{" "}
          </p>
        </div>
      </div>
      <ProjectsSection />
    </div>
  );
}

export default page;
