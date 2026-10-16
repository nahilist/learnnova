"use client";

import { useLayoutEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroProductPreview.css";

const LANDING_PAGE_VIDEO =
  "https://learnnova.s3.us-east-1.amazonaws.com/LandingPageVideo%2B(1).mp4";

function BrowserBar() {
  return (
    <div className="yl-demo-browser" aria-hidden="true">
      <div className="yl-demo-dots"><i /><i /><i /></div>
      <span>youlearn.ai</span>
      <div className="yl-demo-browser-actions"><span>Product tour</span><MoreHorizontal /></div>
    </div>
  );
}

export function HeroProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const shadow = shadowRef.current;
    if (!section || !frame || !shadow) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame,
        { y: 108, scale: 0.74, rotationX: 9.5, borderRadius: 27 },
        {
          y: -22,
          scale: 1.035,
          rotationX: 0,
          borderRadius: 14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "center 48%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        shadow,
        { opacity: 0.5, scaleX: 0.58, y: 18 },
        {
          opacity: 0.14,
          scaleX: 1,
          y: -4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "center 48%",
            scrub: 0.55,
          },
        },
      );
    });

    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame,
        { y: 48, scale: 0.9, rotationX: 4 },
        {
          y: -6,
          scale: 1,
          rotationX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 94%",
            end: "center 60%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className="yl-demo-stage" aria-label="YouLearn landing page video preview">
      <div className="yl-demo-glow" aria-hidden="true" />
      <div ref={frameRef} className="yl-demo-frame">
        <BrowserBar />
        <div className="yl-demo-viewport">
          <video
            className="yl-demo-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/landing-page-video-poster.jpg"
            aria-label="YouLearn product tour"
          >
            <source src={LANDING_PAGE_VIDEO} type="video/mp4" />
            <source src="/landing-page-video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div ref={shadowRef} className="yl-demo-shadow" aria-hidden="true" />
    </section>
  );
}
