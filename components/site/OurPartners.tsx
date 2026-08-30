"use client";

import React from "react";
import Image from "next/image";
import SectionBorderTitle from "./SectionBorderTitle";
import ProjectsSlider from "../ui/ProjectsSlider";
import { Reveal } from "../ui/Reveal";
import PartnerLogo from "../../public/images/colorlogo.png";

const partners = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `همکار ${i + 1}`,
  logo: PartnerLogo,
}));

function OurPartners() {
  return (
    <div className="container mx-auto py-10 text-center">
      <Reveal>
        <SectionBorderTitle className="text-gray-900 text-center my-5">
          شرکت‌هایی که با پویان همکاری دارند
        </SectionBorderTitle>
      </Reveal>

      <Reveal delay={150} className="mt-14">
        <ProjectsSlider>
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex-shrink-0 p-4 flex items-center justify-center h-32"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={80}
                className="w-[100px] md:w-[150px] h-auto object-contain mx-0 md:mx-10 opacity-80 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </ProjectsSlider>
      </Reveal>
    </div>
  );
}

export default OurPartners;
