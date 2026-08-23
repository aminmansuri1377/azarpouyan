// components/ProjectsSection.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard";
import DotPattern from "./DotPattern";
import SectionBorderTitle from "./SectionBorderTitle";
import { Button } from "../ui";
import { trpc } from "@/lib/trpc/client";

const defaultDemoProjects = [
  {
    id: "demo-1",
    slug: "project-1",
    imageSrc: "/images/project1.png",
    title: "پردیس پویان",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۱",
  },
  {
    id: "demo-2",
    slug: "project-2",
    imageSrc: "/images/project2.png",
    title: "مجتمع تجاری اداری پویان",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۲",
  },
  {
    id: "demo-3",
    slug: "project-3",
    imageSrc: "/images/project1.png",
    title: "برج مسکونی آرامش",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۳",
  },
  {
    id: "demo-4",
    slug: "project-4",
    imageSrc: "/images/project2.png",
    title: "شهرک ویلایی سروستان",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۴",
  },
  {
    id: "demo-5",
    slug: "project-5",
    imageSrc: "/images/project1.png",
    title: "پروژه مسکونی نگین",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۵",
  },
  {
    id: "demo-6",
    slug: "project-6",
    imageSrc: "/images/project2.png",
    title: "مجتمع اقامتی رویال",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۶",
  },
];

export default function ProjectsSection({
  withMore = false,
  locale: propLocale,
}: {
  withMore?: boolean;
  locale?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const locale = propLocale || (params?.locale as string) || "fa";

  const { data } = trpc.public.getProjects.useQuery(
    {
      locale,
      limit: 6,
    },
    {
      retry: false,
    },
  );

  const projects =
    data?.items && data.items.length > 0
      ? data.items.map((item) => ({
          id: item.id,
          slug: item.translations?.[0]?.slug || item.slug,
          imageSrc: item.imageUrl || "/images/project1.png",
          title: item.translations?.[0]?.name || item.slug,
          description:
            item.translations?.[0]?.summary ||
            "پروژه ساختمانی و عمرانی مدرن با امکانات رفاهی کامل",
          imageAlt: item.translations?.[0]?.name || item.slug,
        }))
      : defaultDemoProjects;

  return (
    <section className="relative bg-neutral-900 py-20 px-6 md:px-12 lg:px-20 overflow-hidden font-peyda-medium">
      {/* Dot Pattern Background */}
      <DotPattern />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <SectionBorderTitle className="text-white">
              پروژه های ما
            </SectionBorderTitle>
          </div>
          <p
            className="text-gray-400 text-sm max-w-3xl mx-auto leading-relaxed"
            dir="rtl"
          >
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              imageSrc={project.imageSrc}
              title={project.title}
              description={project.description}
              imageAlt={project.imageAlt}
              href={`/${locale}/workExamples/${project.slug}`}
              className={index % 2 === 0 ? "md:order-1" : "md:order-2"}
            />
          ))}
        </div>

        {/* More Projects Button */}
        {withMore && (
          <div className="text-right mt-14">
            <Button
              onClick={() => router.push(`/${locale}/workExamples`)}
              className="transition-colors duration-300 cursor-pointer"
              dir="rtl"
            >
              پروژه های بیشتر
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
