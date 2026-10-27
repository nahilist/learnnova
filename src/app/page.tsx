"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HeroProductPreview } from "@/components/HeroProductPreview";
import { TrustedBy } from "@/components/TrustedBy";
import { FeatureSection } from "@/components/FeatureSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import { ClosingCta } from "@/components/ClosingCta";
import { Footer } from "@/components/Footer";
import { ModalDemo } from "@/components/ModalDemo";

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
  });

  const handleOpenDemo = (title: string, subtitle: string) => {
    setModalState({
      isOpen: true,
      title,
      subtitle,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleScrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-200 overflow-x-hidden">
      {/* Ambient background atmosphere gradient matching youlearn.ai */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[680px] -z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(219,234,254,0.45)_0%,_rgba(239,246,255,0.25)_45%,_transparent_75%)]" />
      </div>

      {/* Navigation */}
      <Navbar onOpenDemo={handleOpenDemo} />

      <main className="flex-1 w-full">
        {/* 1. Hero Section */}
        <Hero
          onOpenDemo={handleOpenDemo}
          onScrollToFeatures={handleScrollToFeatures}
        />

        {/* 2. Interactive Study Dashboard Hero Preview */}
        <HeroProductPreview />

        {/* 3. Trusted By University Seals */}
        <TrustedBy />

        {/* 4. Main Feature Section (Video Player + 3 subcards) */}
        <FeatureSection onOpenDemo={handleOpenDemo} />

        {/* 5. Built For Any Use Case Section */}
        <UseCasesSection onOpenDemo={handleOpenDemo} />

        {/* 6. Testimonials Section */}
        <Testimonials />

        {/* 7. FAQs Accordion */}
        <FaqSection />

        {/* 8. Closing CTA with App Store Badges */}
        <ClosingCta onOpenDemo={handleOpenDemo} />
      </main>

      {/* 9. Complete Footer */}
      <Footer onOpenDemo={handleOpenDemo} />

      {/* Global Interactive Demo Modal */}
      <ModalDemo
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        subtitle={modalState.subtitle}
      />
    </div>
  );
}
