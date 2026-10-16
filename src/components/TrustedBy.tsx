"use client";

import React from "react";
import { 
  PrincetonSeal, 
  StanfordSeal, 
  HarvardSeal, 
  UCLASeal, 
  UPennSeal, 
  UChicagoSeal, 
  MichiganSeal 
} from "./Icons";

export function TrustedBy() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-6 py-12 md:py-16 text-center select-none overflow-hidden">
      <h2 className="text-xl sm:text-[22px] md:text-[24px] font-normal text-neutral-600 mb-10 tracking-tight">
        Trusted by top students all over the world
      </h2>

      {/* Grid / flex of University Crests */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 transition-opacity">
        <div className="transition-transform hover:scale-110 duration-200" title="Princeton University">
          <PrincetonSeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="Stanford University">
          <StanfordSeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="Harvard University">
          <HarvardSeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="University of California (UCLA)">
          <UCLASeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="University of Pennsylvania">
          <UPennSeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="University of Chicago">
          <UChicagoSeal className="h-10 sm:h-12 w-auto" />
        </div>
        <div className="transition-transform hover:scale-110 duration-200" title="Michigan State University">
          <MichiganSeal className="h-10 sm:h-12 w-auto" />
        </div>
      </div>
    </section>
  );
}
