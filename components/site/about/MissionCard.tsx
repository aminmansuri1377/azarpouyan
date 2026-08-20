// components/site/about/MissionCard.tsx
import React from "react";

interface MissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function MissionCard({
  icon,
  title,
  description,
  className = "",
}: MissionCardProps) {
  return (
    <div
      dir="rtl"
      className={`flex items-start gap-4 border border-black  p-5 text-right transition-shadow duration-300 hover:shadow-md sm:p-6 ${className}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary md:h-14 md:w-14">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-peyda-bold text-sm text-foreground md:text-base">
          {title}
        </h3>

        <p className="mt-2 font-peyda-regular text-xs leading-loose text-foreground/70">
          {description}
        </p>
      </div>
    </div>
  );
}
