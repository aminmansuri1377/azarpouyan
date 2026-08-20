"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getMessages } from "@/messages";

import AboutHero from "@/components/site/about/AboutHero";
import VisionSection from "@/components/site/about/VisionSection";
import MissionSection from "@/components/site/about/MissionSection";
import StatsSection from "@/components/site/about/StatsSection";
import JournalSection from "@/components/site/about/JournalSection";
import PartnersSection from "@/components/site/about/PartnersSection";

function AboutUs() {
  const params = useParams();

  const locale = (params.locale as string) ?? "fa";
  const t = getMessages(locale);

  return (
    <main className="overflow-hidden bg-background text-foreground mt-10">
      <AboutHero
        label={t.aboutUs}
        tagline={t.hero.tagline}
        description={t.hero.description}
      />

      <VisionSection
        tagline={t.hero.tagline}
        description={t.hero.description}
      />

      <MissionSection description={t.hero.description} />

      <StatsSection locale={locale} />

      <JournalSection description={t.hero.description} />

      <PartnersSection description={t.hero.description} />
    </main>
  );
}

export default AboutUs;
