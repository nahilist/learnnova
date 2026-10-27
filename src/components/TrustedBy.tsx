"use client";

import React from "react";
import {
  UCLASeal,
  UPennSeal,
  CornellSeal,
  MichiganBlockM,
  MITSeal,
  PrincetonSeal,
  HarvardSeal,
  StanfordSeal,
  MichiganStateSeal,
} from "./Icons";

export function TrustedBy() {
  const seals = [
    { name: "UCLA", component: UCLASeal },
    { name: "UPenn", component: UPennSeal },
    { name: "Cornell", component: CornellSeal },
    { name: "Michigan State", component: MichiganStateSeal },
    { name: "MIT", component: MITSeal },
    { name: "University of Michigan", component: MichiganBlockM },
    { name: "Princeton", component: PrincetonSeal },
    { name: "Harvard", component: HarvardSeal },
    { name: "Stanford", component: StanfordSeal },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 pb-16 md:pt-8 md:pb-20 text-center select-none overflow-hidden">
      {/* Heading matching YouLearn */}
      <h2 className="text-[17px] sm:text-lg md:text-[19px] text-neutral-500 font-normal tracking-[-0.01em] mb-10 sm:mb-12">
        Trusted by top students all over the world
      </h2>

      {/* University Logos Row */}
      <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-10 md:gap-14 lg:gap-16 opacity-90 transition-all duration-300">
        {seals.map((item, idx) => {
          const SealComponent = item.component;
          return (
            <div
              key={idx}
              title={item.name}
              className="flex items-center justify-center grayscale-[20%] hover:grayscale-0 hover:scale-105 transition-all duration-200 cursor-default"
            >
              <SealComponent className="h-9 sm:h-11 md:h-12 w-auto" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

