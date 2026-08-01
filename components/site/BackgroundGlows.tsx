"use client";

import React from "react";

export function BackgroundGlows() {
  // These ellipses are positioned dynamically relative to the center (50%) of a 1440px grid layout.
  // This ensures they stay perfectly aligned with the website content as the screen scales,
  // rather than drifting off-screen on wider viewports.
  const ellipses = [
    {
      id: "ellipse-18",
      name: "Ellipse 18",
      top: "120px",
      left: "calc(50% + 251px)", // 971px Figma Left -> Center Offset: 971 - 720 = 251px
      opacity: 0.4,
    },
    {
      id: "ellipse-16",
      name: "Ellipse 16",
      top: "1876px",
      left: "calc(50% - 918px)", // -198px Figma Left -> Center Offset: -198 - 720 = -918px
      opacity: 0.4,
    },
    {
      id: "ellipse-29",
      name: "Ellipse 29",
      top: "3360px",
      left: "calc(50% + 197px)", // 917px Figma Left -> Center Offset: 917 - 720 = 197px
      opacity: 0.4,
    },
    {
      id: "ellipse-15",
      name: "Ellipse 15",
      top: "3976px",
      left: "calc(50% - 1045px)", // -325px Figma Left -> Center Offset: -325 - 720 = -1045px
      opacity: 0.4,
    },
    {
      id: "ellipse-19",
      name: "Ellipse 19",
      top: "4533px",
      left: "calc(50% + 476px)", // 1196px Figma Left -> Center Offset: 1196 - 720 = 476px
      opacity: 0.4,
    },
    {
      id: "ellipse-20",
      name: "Ellipse 20",
      top: "5943px",
      left: "calc(50% - 1298px)", // -578px Figma Left -> Center Offset: -578 - 720 = -1298px
      opacity: 0.4,
    },
    {
      id: "ellipse-21",
      name: "Ellipse 21",
      top: "7443px",
      left: "calc(50% + 621px)", // 1341px Figma Left -> Center Offset: 1341 - 720 = 621px
      opacity: 0.3, // Slightly higher opacity in Figma for testimonials section
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {ellipses.map((ellipse) => (
        <div
          key={ellipse.id}
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: "728px",
            height: "728px",
            left: ellipse.left,
            top: ellipse.top,
            backgroundColor: `rgba(215, 165, 57, ${ellipse.opacity})`,
            filter: "blur(291.2px)",
            WebkitFilter: "blur(291.2px)", // Safari fallback
            willChange: "filter", // GPU hardware acceleration for rendering smooth blurs
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
