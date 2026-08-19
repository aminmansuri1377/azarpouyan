// components/ProjectCard.tsx
import Image from "next/image";

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
  imageAlt?: string;
  className?: string;
}

export default function ProjectCard({
  imageSrc,
  title,
  description,
  imageAlt = "پروژه",
  className = "",
}: ProjectCardProps) {
  return (
    <div
      className={`group relative bg-white rounded-sm overflow-hidden shadow-sm ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Title Overlay on Image */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-sm">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center justify-between" dir="rtl">
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          {description}
        </p>
        <button
          className="mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
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
        </button>
      </div>
    </div>
  );
}
