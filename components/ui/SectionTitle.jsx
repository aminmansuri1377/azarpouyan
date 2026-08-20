"use client";

import { cn } from "@/lib/cn";
import React from "react";

const SectionTitle = ({ children, sticky = true, className }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-4",
        sticky
          ? "sticky top-14 lg:top-20 z-30 bg-background/85 backdrop-blur-md py-4 md:py-6 transition-shadow duration-300"
          : "md:my-20 my-5",
        className,
      )}
    >
      <div className="h-px flex-1 bg-primary" />

      <h2 className="text-outline whitespace-nowrap text-4xl md:text-6xl">
        {children}
      </h2>

      <div className="h-px flex-1 bg-primary" />
    </div>
  );
};

export default SectionTitle;
