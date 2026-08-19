// components/WhyUsCard.tsx
import React from "react";

interface WhyUsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function WhyUsCard({
  icon,
  title,
  description,
  className = "",
}: WhyUsCardProps) {
  return (
    <div
      className={`relative border border-black bg-background p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      dir="rtl"
    >
      {/* Hexagon Icon */}
      <div className="mb-6">{icon}</div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-7">{description}</p>
    </div>
  );
}
