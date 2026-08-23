"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import ProjectCard from "@/components/site/ProjectCard";
import { ProductSearch } from "@/components/site/ProductSearch";
import { Pagination } from "@/components/site/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import SectionBorderTitle from "@/components/site/SectionBorderTitle";
import Office from "../../../public/images/office.jpg";

export default function WorkExamplesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = trpc.public.getProjects.useQuery(
    {
      locale,
      search: debouncedSearch,
      page,
      limit,
    },
    {
      retry: false,
    },
  );

  return (
    <div className="mt-20 font-peyda-regular" dir="rtl">
      {/* Intro / Hero section */}
      <div className="md:grid md:grid-cols-2 gap-12 lg:gap-24 items-center p-6 sm:p-10 md:p-20">
        <div className="relative w-full aspect-[1.5] overflow-hidden order-2 rounded-lg">
          <Image
            src={Office}
            alt="نمونه کارهای ما"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-3 sm:inset-4 border-2 border-white/70 pointer-events-none" />
        </div>
        <div className="order-1 mt-6 md:mt-0">
          <div className="mb-4">
            <span className="text-primary font-bold text-lg">نمونه کارهای ما :</span>
          </div>
          <h1 className="font-bold my-6 md:my-8 text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground">
            هر خــانه، نقطه آغــاز یــک داستـان اســت؛ داستان آرامش، امنیت، رشد و آینده
          </h1>
          <p className="text-justify text-muted-foreground leading-loose text-sm md:text-base">
            ما با اتکا به تجربه، نوآوری و استانداردهای روز بین‌المللی در زمینه طراحی و ساخت پروژه‌های ساختمانی، تجاری و مسکونی پیشرو هستیم. هدف ما خلق فضاهایی پایدار، مدرن و باکیفیت برای نسل‌های آینده است.
          </p>
        </div>
      </div>

      {/* Projects listing section */}
      <section className="py-16 px-6 sm:px-10 md:px-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="text-center md:text-right">
              <SectionBorderTitle className="text-foreground">
                همه پروژه‌ها و نمونه‌کارها
              </SectionBorderTitle>
              <p className="text-sm text-muted-foreground mt-2">
                مجموع پروژه‌های ثبتی: {data?.total ?? 0}
              </p>
            </div>

            <div className="w-full md:w-80">
              <ProductSearch
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {isFetching && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              در حال بارگذاری نتایج جستجو...
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              در حال دریافت پروژه‌ها...
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.items.map((project) => {
                  const translation = project.translations?.[0];
                  const projectSlug = translation?.slug || project.slug;
                  const title = translation?.name || project.slug;
                  const description =
                    translation?.summary ||
                    "پروژه ساختمانی و عمرانی مدرن با استانداردهای نوین ساخت";

                  return (
                    <ProjectCard
                      key={project.id}
                      imageSrc={project.imageUrl || "/images/project1.png"}
                      title={title}
                      description={description}
                      imageAlt={title}
                      href={`/${locale}/workExamples/${projectSlug}`}
                    />
                  );
                })}
              </div>

              <div className="mt-12">
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">پروژه‌ای با این مشخصات یافت نشد.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
