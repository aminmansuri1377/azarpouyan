"use client";

import { useEffect, useRef, useState } from "react";

interface ProjectsSliderProps {
  children: React.ReactNode;
  speed?: number;
}

export default function ProjectsSlider({
  children,
  speed = 0.5,
}: ProjectsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrame: number;

    const animate = () => {
      if (!isDragging) {
        slider.scrollLeft += speed;

        // ریست وقتی به نصف رسید (چون children دو بار تکرار شده)
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, speed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const slider = sliderRef.current;
    if (!slider) return;

    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
    slider.classList.add("cursor-grabbing");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    sliderRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    sliderRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const slider = sliderRef.current;
    if (!slider) return;

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={sliderRef}
      dir="ltr"
      className="overflow-x-hidden cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div ref={trackRef} className="flex gap-6 w-fit">
        {children}
        {children}
      </div>
    </div>
  );
}
