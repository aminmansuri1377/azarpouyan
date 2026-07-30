"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import BlogImage from "../../../public/images/bloghero.jpg";
import { getMessages } from "@/messages";
import Hands from "../../../public/images/hands.jpg";
import Oil from "../../../public/images/oil.jpg";
import Cow from "../../../public/images/cow.jpg";
import Ship from "../../../public/images/ship.jpg";
import Chart from "../../../public/images/chartgold.jpg";
import { ServiceBanner } from "@/components/site/ServiceBanner";
const Samples = [
  {
    id: 1,
    image: Hands,
    title: "ارائه تمام خدمات بازرگانی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...",
  },
  {
    id: 2,
    image: Oil,
    title: "ارائه تمام خدمات بازرگانی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...",
  },
  {
    id: 3,
    image: Cow,
    title: "ارائه تمام خدمات بازرگانی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...",
  },
  {
    id: 4,
    image: Ship,
    title: "ارائه تمام خدمات بازرگانی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...",
  },
  {
    id: 5,
    image: Chart,
    title: "ارائه تمام خدمات بازرگانی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...",
  },
];
export default function BlogPage() {
  const params = useParams();

  const locale = params.locale as string;
  const t = getMessages(locale);

  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = trpc.public.getBlogs.useQuery({
    locale,
  });
  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت");
    }
  }, [error]);
  return (
    <section className="relative isolate min-h-[85vh] w-full items-center justify-center overflow-hidden">
      <Image
        src={BlogImage}
        alt="Blog background"
        className="object-cover w-full"
      />
      <div className="absolute inset-0 text-center mt-30">
        <h1 className=" font-peyda-bold text-4xl text-white lg:mt-20">
          {t.newestBlogs}
        </h1>
        <p className=" font-peyda-regular text-white my-10 w-[40%] mx-auto">
          {t.hero.description}
        </p>
        <div className="order-2 rounded-[40px] bg-white/20 p-5 lg:p-16 backdrop-blur-sm md:order-1 mx-5 lg:mx-20 text-right md:mt-20">
          <h1 className=" lg:text-2xl font-peyda-bold text-white">
            {t.learnWithTitle}
          </h1>
          <p className=" font-peyda-regular text-white my-10">
            {t.hero.description}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-20">
        {Samples?.map((s) => (
          <div key={s.id}>
            <ServiceBanner
              image={s.image}
              title={s.title}
              description={s.description}
              primaryButton={t.readMore}
            />
          </div>
        ))}
      </div>
      <h1>Blogs</h1>

      {blogs?.map((blog: any) => {
        const t = blog.translations[0];

        if (!t) return null;

        return (
          <div key={blog.id}>
            <Link href={`/${locale}/blog/${t.slug}`}>{t.title}</Link>
          </div>
        );
      })}
    </section>
  );
}
