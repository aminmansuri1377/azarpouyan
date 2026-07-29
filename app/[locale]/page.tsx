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

  const { data: categories } = trpc.public.getCategoryTree.useQuery({
    locale,
  });

  const shouldSearch = debouncedSearch.trim().length > 0;

  const { data: products, isFetching } = trpc.public.searchProducts.useQuery(
    {
      locale,

      search: debouncedSearch,

      page,

      limit: 12,
    },
    {
      enabled: shouldSearch,
    },
  );

  return (
    <div>
      <Hero locale={locale} />

      {/* <hr /> */}
      <OurStory locale={locale} />
      <Collaboration locale={locale} />
      <div>
        <h1 className="text-2xl font-peyda-bold mb-4 mx-auto text-center">
          {t.baseServices}
        </h1>
        <h2 className=" font-peyda-regular text-center my-10 w-[50%] mx-auto">
          {t.hero.description}
        </h2>
      </div>
      <ServiceBanner
        image={Hands}
        title="ارائه تمام خدمات بازرگانی"
        description="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ..."
        primaryButton={t.hero.seeServices}
        secondaryButton={t.hero.receiveConsulting}
      />
      <ServiceBanner
        image={Oil}
        title="ارائه تمام خدمات بازرگانی"
        description="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ..."
        primaryButton={t.hero.seeServices}
        secondaryButton={t.hero.receiveConsulting}
      />
      <ServiceBanner
        image={Cow}
        title="ارائه تمام خدمات بازرگانی"
        description="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ..."
        primaryButton={t.hero.seeServices}
        secondaryButton={t.hero.receiveConsulting}
      />

      <div className="m-20">
        <ProductSearch value={search} onChange={setSearch} />
      </div>

      {shouldSearch ? (
        <>
          {isFetching && (
            <div
              style={{
                marginBottom: 10,
              }}
            >
              Searching...
            </div>
          )}

          <div
            style={{
              marginBottom: 15,
              fontWeight: 600,
            }}
          >
            Total Results: {products?.total ?? 0}
          </div>

          {products?.items.length === 0 ? (
            <div>No Products Found</div>
          ) : (
            products?.items.map((product) => {
              const t = product.translations[0];

              return (
                <div
                  key={product.id}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Link href={`/${locale}/products/${t.slug}`}>{t.name}</Link>
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
