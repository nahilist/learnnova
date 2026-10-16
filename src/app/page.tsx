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
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-200">
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
