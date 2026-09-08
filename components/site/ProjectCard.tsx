// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  imageAlt?: string;
  className?: string;
  href?: string;
}

export default function ProjectCard({
  imageSrc,
  title,
  description,
  imageAlt = "پروژه",
  className = "",
  href,
}: ProjectCardProps) {
  const content = (
    <div
      className={`group relative bg-white dark:bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[1.5] overflow-hidden bg-muted">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
            بدون تصویر
          </div>
        )}
        <div className="absolute inset-3 sm:inset-4 border-2 border-white/70 pointer-events-none" />
      </div>

      {/* Content */}
      <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white truncate m-5">
        {title}
      </h3>
      <div className="p-5 flex items-center justify-between" dir="rtl">
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1 line-clamp-2">
          {description}
        </p>
        <div
          className="mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300"
          aria-label="مشاهده پروژه"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rotate-180"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-transform duration-200 hover:-translate-y-1"
      >
        {content}
      </Link>
    );
  }

  return content;
}
