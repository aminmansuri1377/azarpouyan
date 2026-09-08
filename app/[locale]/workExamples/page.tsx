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
import DotPattern from "@/components/site/DotPattern";

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
            <span className="text-black font-bold text-lg">
              نمونه کارهای ما :
            </span>
          </div>
          <h1 className="font-bold my-6 md:my-8 text-2xl md:text-3xl leading-relaxed text-foreground">
            ایده‌هایی که ساخته‌ایم، ارزش‌هایی که خلق کرده‌ایم{" "}
          </h1>
          <p className="text-justify text-muted-foreground leading-loose text-sm md:text-base">
            هر پروژه برای پویان، فرصتی است برای تبدیل یک ایده به فضایی برای
            زندگی. از نخستین نگاه به زمین و شناخت ظرفیت‌های آن تا طراحی معماری،
            انتخاب مصالح و اجرای نهایی، تلاش می‌کنیم میان زیبایی، کارایی، کیفیت
            و ارزش ماندگار تعادل ایجاد کنیم. برای ما، ساختن تنها به معنای
            شکل‌دادن به یک بنا نیست؛ بلکه اندیشیدن به زندگی‌ای است که در آن
            جریان پیدا می‌کند. در این مسیر، هر انتخاب اهمیت دارد؛ از نور و تناسب
            فضاها تا جزئیاتی که بر آسایش و تجربه روزمره ساکنان تأثیر می‌گذارند.
            هدف ما خلق فضاهایی است که نه‌تنها در نگاه اول، بلکه در گذر زمان نیز
            دلپذیر و کارآمد بمانند و حس آرامش و تعلق را حفظ کنند. آنچه در ادامه
            می‌بینید، بخشی از مسیر پویان در تبدیل این نگاه به واقعیت است. هر
            پروژه، روایت ایده‌ها و انتخاب‌هایی است که در کنار هم به یک بنا هویت
            می‌بخشند؛ بنایی که پایان ساخت آن، آغاز زندگی و شکل‌گیری خاطره‌های
            تازه است.{" "}
          </p>
        </div>
      </div>

      {/* Projects listing section */}
      <section className="py-16 px-6 sm:px-10 md:px-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto ">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
              <div className="text-center md:text-right">
                <SectionBorderTitle className="text-foreground">
                  همه پروژه‌ها و نمونه‌کارها
                </SectionBorderTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  مجموع پروژه‌های ثبتی: {data?.total ?? 0}
                </p>
              </div>
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
