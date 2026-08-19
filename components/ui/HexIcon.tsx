// components/HexIcon.tsx
import React from "react";

interface HexIconProps {
  children: React.ReactNode;
  className?: string;
}

export default function HexIcon({ children, className = "" }: HexIconProps) {
  return (
    <div
      className={`relative w-16 h-16 flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M32 4L58 18V46L32 60L6 46V18L32 4Z"
          stroke="#C9A84C"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <div className="relative z-10 text-amber-600">{children}</div>
    </div>
  );
}
