"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { trpc } from "@/lib/trpc/client";
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

  const {
    data: blogs,
    isLoading,
    error,
  } = trpc.public.getBlogs.useQuery({
    locale,
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || "خطا در دریافت بلاگ‌ها");
    }
  }, [error]);

  /**
   * چون در API ترجمه‌ها با locale فیلتر شده‌اند،
   * برای هر بلاگ فقط translations[0] را می‌خوانیم.
   */
  const databaseBlogs =
    blogs?.flatMap((blog) => {
      const translation = blog.translations[0];

      if (!translation) {
        return [];
      }

      return [
        {
          id: blog.id,
          image: blog.coverImage || Chart,
          title: translation.title,
          description: translation.excerpt || "",
          href: `/${locale}/blog/${translation.slug}`,
        },
      ];
    }) ?? [];

  return (
    <div dir="rtl" className="bg-background">
      {/* =========================
          Hero دسکتاپ
      ========================== */}
      <section className="relative hidden md:block">
        <Image
          src={BlogImage}
          alt="Blog background"
          className="h-auto w-full object-cover object-[50%_center] md:object-center"
          priority
        />

        <div className="absolute inset-0 mt-30 text-center">
          <h1 className="font-peyda-bold text-4xl text-white lg:mt-20">
            {t.newestBlogs}
          </h1>

          <p className="mx-auto my-10 w-[40%] font-peyda-regular text-white">
            {t.hero.description}
          </p>

          <div className="order-2 mx-5 mt-20 rounded-[40px] bg-white/20 p-5 text-start backdrop-blur-sm md:order-1 lg:mx-20 lg:p-16">
            <h2 className="font-peyda-bold text-white lg:text-2xl">
              {t.learnWithTitle}
            </h2>

            <p className="my-10 font-peyda-regular text-white">
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Hero موبایل
      ========================== */}
      <section className="relative isolate overflow-hidden md:hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/bloghero.jpg')",
          }}
        />

        <div className="absolute inset-0 -z-10 bg-[rgba(15,28,45,0.65)]" />

        <div className="px-6 pb-10 pt-24 text-center">
          <h1 className="font-peyda-bold text-3xl leading-[1.5] text-white">
            {t.newestBlogs}
          </h1>

          <p className="mx-auto mt-4 font-peyda-regular text-base leading-[1.8] text-white">
            {t.hero.description}
          </p>

          <Button className="mt-8 px-10 font-peyda-bold">دریافت مشاوره</Button>
        </div>
      </section>

      {/* =========================
          توضیحات موبایل
      ========================== */}
      <section className="px-6 py-10 md:hidden">
        <h2 className="mb-4 font-peyda-bold text-2xl text-black">
          {t.learnWithTitle}
        </h2>

        <p className="font-peyda-regular text-sm leading-[1.8] text-black/80">
          {t.hero.description}
        </p>
      </section>

      {/* =========================
          دسکتاپ: نمونه‌ها + دیتابیس
      ========================== */}
      <section className="hidden bg-background px-6 py-20 md:block">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8">
          {/* ابتدا نمونه‌های ثابت */}
          {Samples.map((sample) => (
            <BlogCard
              key={`sample-desktop-${sample.id}`}
              image={sample.image}
              title={sample.title}
              description={sample.description}
            />
          ))}

          {/* سپس بلاگ‌های دیتابیس */}
          {isLoading && (
            <div className="col-span-2 py-10 text-center font-peyda-regular">
              در حال بارگذاری بلاگ‌ها...
            </div>
          )}

          {!isLoading && databaseBlogs.length === 0 && (
            <div className="col-span-2 py-10 text-center font-peyda-regular text-gray-500">
              بلاگ جدیدی برای نمایش وجود ندارد.
            </div>
          )}

          {databaseBlogs.map((blog) => (
            <BlogCard
              key={`database-desktop-${blog.id}`}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              href={blog.href}
            />
          ))}
        </div>
      </section>

      {/* =========================
          موبایل: نمونه‌ها + دیتابیس
      ========================== */}
      <section className="flex flex-col gap-5 bg-[#F5F5F7] px-4 py-8 md:hidden">
        {/* ابتدا نمونه‌های ثابت */}
        {Samples.map((sample) => (
          <BlogCard
            key={`sample-mobile-${sample.id}`}
            image={sample.image}
            title={sample.title}
            description={sample.description}
          />
        ))}

        {/* سپس بلاگ‌های دیتابیس */}
        {isLoading && (
          <div className="py-8 text-center font-peyda-regular">
            در حال بارگذاری بلاگ‌ها...
          </div>
        )}

        {!isLoading && databaseBlogs.length === 0 && (
          <div className="py-8 text-center font-peyda-regular text-gray-500">
            بلاگ جدیدی برای نمایش وجود ندارد.
          </div>
        )}

        {databaseBlogs.map((blog) => (
          <BlogCard
            key={`database-mobile-${blog.id}`}
            image={blog.image}
            title={blog.title}
            description={blog.description}
            href={blog.href}
          />
        ))}
      </section>
    </div>
  );
}
