// components/ProjectsSection.tsx
import ProjectCard from "./ProjectCard";
import DotPattern from "./DotPattern";
import SectionBorderTitle from "./SectionBorderTitle";
import { Button } from "../ui";
// import Img1 from "../../public/images/project1.png";
// import Img12 from "../../public/images/project2.png";
interface Project {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
  imageAlt: string;
}

const projects: Project[] = [
  {
    id: 1,
    imageSrc: "/images/project1.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۱",
  },
  {
    id: 2,
    imageSrc: "/images/project2.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۲",
  },
  {
    id: 3,
    imageSrc: "/images/project1.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۳",
  },
  {
    id: 4,
    imageSrc: "/images/project2.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ",
  },
  {
    id: 5,
    imageSrc: "/images/project1.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۵",
  },
  {
    id: 6,
    imageSrc: "/images/project2.png",
    title: "پروژه های ما:",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    imageAlt: "پروژه ۶",
  },
];

export default function ProjectsSection() {
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
              className={index % 2 === 0 ? "md:order-1" : "md:order-2"}
            />
          ))}
        </div>

        {/* More Projects Button */}
        <div className="text-right mt-14">
          <Button className=" transition-colors duration-300" dir="rtl">
            پروژه های بیشتر
          </Button>
        </div>
      </div>
    </section>
  );
}
