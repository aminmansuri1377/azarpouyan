"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { getMessages } from "@/messages";
import Chart from "../../../public/images/chartgold.jpg";
import Ship from "../../../public/images/ship.jpg";
import BlogImage from "../../../public/images/bloghero.jpg";
import { BlogCard } from "@/components/site/BlogCard";
import { Button } from "@/components/ui";

const Samples = [
  {
    id: 1,
    image: Chart,
    title: "تاثیر نوسانات طلا در بازار جهانی",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
  {
    id: 2,
    image: Ship,
    title: "جابجا شدن قیمت نفت",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
  {
    id: 3,
    image: Chart,
    title: "تاثیر نوسانات طلا در بازار جهانی",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
  {
    id: 4,
    image: Ship,
    title: "جابجا شدن قیمت نفت",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
  {
    id: 5,
    image: Chart,
    title: "تاثیر نوسانات طلا در بازار جهانی",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
  {
    id: 6,
    image: Ship,
    title: "جابجا شدن قیمت نفت",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و طراحی گرافیک است. لورم ایپسوم متن بسیار ساختگی با تولید سادگی ...",
  },
];

export default function BlogPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getMessages(locale);

  const { data: blogs, error } = trpc.public.getBlogs.useQuery({ locale });

  useEffect(() => {
    if (error) toast.error(error.message || "خطا در دریافت");
  }, [error]);

  return (
    <div dir="rtl" className="bg-background">
      {/* دسکتاپ hero — */}
      <section className="hidden md:block relative">
        <Image
          src={BlogImage}
          alt="Blog background"
          className="object-cover object-[50%_center] md:object-center w-full"
        />
        <div className="absolute inset-0 text-center mt-30">
          <h1 className="font-peyda-bold text-4xl text-white lg:mt-20">
            {t.newestBlogs}
          </h1>
          <p className="font-peyda-regular text-white my-10 w-[40%] mx-auto">
            {t.hero.description}
          </p>
          <div className="order-2 rounded-[40px] bg-white/20 p-5 lg:p-16 backdrop-blur-sm md:order-1 mx-5 lg:mx-20 text-start md:mt-20">
            <h1 className="lg:text-2xl font-peyda-bold text-white">
              {t.learnWithTitle}
            </h1>
            <p className="font-peyda-regular text-white my-10">
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* موبایل hero */}
      <section className="md:hidden relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bloghero.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[rgba(15,28,45,0.65)]" />
        <div className="px-6 pt-24 pb-10 text-center">
          <h1 className="font-peyda-bold text-3xl leading-[1.5] text-white">
            {t.newestBlogs}
          </h1>
          <p className="mx-auto mt-4 font-peyda-regular text-base leading-[1.8] text-white">
            {t.hero.description}
          </p>
          <Button className="mt-8 px-10 font-peyda-bold">دریافت مشاوره</Button>
        </div>
      </section>

      {/* "با کیان گستر یاد بگیرید" — فقط موبایل */}
      <section className="md:hidden px-6 py-10">
        <h2 className="font-peyda-bold text-2xl text-black mb-4">
          {t.learnWithTitle}
        </h2>
        <p className="font-peyda-regular text-sm leading-[1.8] text-black/80">
          {t.hero.description}
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Blog grid — دسکتاپ ()                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="hidden md:block px-6 py-20 bg-background">
        <div className="mx-auto max-w-[1200px] grid grid-cols-2 gap-8">
          {Samples.map((s) => (
            <BlogCard
              key={s.id}
              image={s.image}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Blog list — موبایل                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="md:hidden bg-[#F5F5F7] px-4 py-8 flex flex-col gap-5">
        {Samples.map((s) => (
          <BlogCard
            key={s.id}
            image={s.image}
            title={s.title}
            description={s.description}
          />
        ))}

        {blogs?.map((blog: any) => {
          const bt = blog.translations[0];
          if (!bt) return null;
          return (
            <BlogCard
              key={blog.id}
              image={blog.imageUrl ?? Chart}
              title={bt.title}
              description={bt.excerpt ?? ""}
              href={`/${locale}/blog/${bt.slug}`}
            />
          );
        })}
      </section>
    </div>
  );
}
