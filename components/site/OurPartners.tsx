"use client";

import React from "react";
import Image from "next/image";
import SectionBorderTitle from "./SectionBorderTitle";
import ProjectsSlider from "../ui/ProjectsSlider";
import PartnerLogo from "../../public/images/colorlogo.png";

const partners = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `همکار ${i + 1}`,
  logo: PartnerLogo,
}));

function OurPartners() {
  return (
    <div className="container mx-auto py-10 text-center">
      <SectionBorderTitle className="text-gray-900 text-center my-5">
        شرکت‌هایی که با پویان همکاری دارند
      </SectionBorderTitle>

      <div className="mt-14">
        <ProjectsSlider>
          {partners.map((partner) => (
            <div
              key={partner.id}
              className=" flex-shrink-0 p-4 flex items-center justify-center h-32"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={80}
                className="object-contain mx-10"
              />
            </div>
          ))}
        </ProjectsSlider>
      </div>
    </div>
  );
}

export default OurPartners;
