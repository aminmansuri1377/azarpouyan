"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";
import { PublicCategoryTree } from "@/components/public/PublicCategoryTree";

import { Hero } from "@/components/site/Hero";
import { ProductSearch } from "@/components/site/ProductSearch";
import { Pagination } from "@/components/site/Pagination";

import { useDebounce } from "@/hooks/useDebounce";
import OurStory from "@/components/site/OurStory";
import Hands from "../../public/images/hands.jpg";
import Oil from "../../public/images/oil.jpg";
import Cow from "../../public/images/cow.jpg";
import { ServiceBanner } from "@/components/site/ServiceBanner";
import { getMessages } from "@/messages";
import Collaboration from "@/components/site/Collaboration";
import HowItWorks from "@/components/site/HowItWorks";
import WhyKga from "@/components/site/WhyKga";
import LatestArticles from "@/components/site/LatestArticles";
import StickySection from "../../components/ui/StickySection";
import ProjectsSection from "@/components/site/ProjectsSection";

const Services = [
  {
    id: 1,
    image: Hands,
    title: "ارائه تمام خدمات بازرگانی",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
  {
    id: 2,
    image: Oil,
    title: "ارائه تمام خدمات بازرگانی",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
  {
    id: 3,
    image: Cow,
    title: "ارائه تمام خدمات بازرگانی",
    description:
      "ما یک شرکت بازرگانی بین‌المللی هستیم که تأمین کالاهای صنعتی و دسترسی به داده‌های لحظه‌ای بازار جهانی را در کنار هم ارائه می‌دهیم. هدف ما ساده‌تر کردن فرآیند خرید، تأمین و تصمیم‌گیری در تجارت جهانی است.",
  },
];

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const t = getMessages(locale);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  const { data: categories } = trpc.public.getCategoryTree.useQuery({ locale });

  const shouldSearch = debouncedSearch.trim().length > 0;

  const { data: products, isFetching } = trpc.public.searchProducts.useQuery(
    {
      locale,
      search: debouncedSearch,
      page,
      limit: 12,
    },
    { enabled: shouldSearch },
  );

  return (
    <div>
      <Hero locale={locale} />

      <OurStory locale={locale} />
      {/* <Collaboration locale={locale} /> */}
      <ProjectsSection />

      {/* ===== بخش ۱ : WHAT WE DO ===== */}
      <StickySection title="WHAT WE DO">
        <div>
          <h1 className="mx-auto mb-4 mt-10 text-center font-peyda-bold text-2xl">
            {t.baseServices}
          </h1>
          <h2 className="mx-5 mb-10 text-justify font-peyda-regular md:mx-auto md:w-[50%] md:text-center">
            {t.hero.description}
          </h2>
        </div>

        <div>
          {Services?.map((s) => (
            <div key={s.id}>
              <ServiceBanner
                image={s.image}
                title={s.title}
                description={s.description}
                primaryButton={t.hero.seeServices}
                secondaryButton={t.hero.receiveConsulting}
              />
            </div>
          ))}
        </div>
      </StickySection>

      {/* ===== بخش ۲ : HOW IT WORKS ===== */}
      <StickySection title="HOW IT WORKS" dir="rtl">
        <HowItWorks />
      </StickySection>

      {/* ===== بخش ۳ : WHY CHOOSE US ===== */}
      <StickySection title="? WHY CHOOSE US">
        <WhyKga locale={locale} />
      </StickySection>

      {/* ===== بخش ۴ : ARTICLES ===== */}
      <StickySection title="ARTICLES" dir="rtl">
        <LatestArticles locale={locale} />
      </StickySection>

      {/* ===== جستجوی محصولات (بدون تیتر چسبان) ===== */}
      <div className="m-20">
        <ProductSearch value={search} onChange={setSearch} />
      </div>

      {shouldSearch ? (
        <>
          {isFetching && <div className="mb-3">Searching...</div>}

          <div className="mb-4 font-semibold">
            Total Results: {products?.total ?? 0}
          </div>

          {products?.items.length === 0 ? (
            <div>No Products Found/</div>
          ) : (
            products?.items.map((product) => {
              const tr = product.translations[0];
              return (
                <div key={product.id} className="mb-3">
                  <Link href={`/${locale}/products/${tr.slug}`}>{tr.name}</Link>
                </div>
              );
            })
          )}

          <Pagination
            page={page}
            totalPages={products?.totalPages ?? 0}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          {categories && (
            <PublicCategoryTree locale={locale} categories={categories} />
          )}
        </>
      )}
    </div>
  );
}
