"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroProductPreview.css";

const LANDING_PAGE_VIDEO =
  "https://learnnova.s3.us-east-1.amazonaws.com/LandingPageVideo%2B(1).mp4";

export function HeroProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;
    const glow = glowRef.current;
    const shadow = shadowRef.current;
    if (!section || !frame || !video || !glow || !shadow) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 88px",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          frame,
          {
            y: 50,
            scaleX: 0.62,
            scaleY: 0.68,
            rotationX: 18,
            borderRadius: "32px 32px 52px 52px",
          },
          {
            y: -10,
            scaleX: 1,
            scaleY: 1,
            rotationX: 0,
            borderRadius: "36px 36px 14px 14px",
          },
          0,
        )
        .fromTo(
          video,
          { scale: 0.92, yPercent: 4 },
          { scale: 1.06, yPercent: 0 },
          0,
        )
        .fromTo(
          glow,
          { opacity: 0.35, scale: 0.68 },
          { opacity: 1, scale: 1.08 },
          0,
        )
        .fromTo(
          shadow,
          { opacity: 0.48, scaleX: 0.5, y: 24 },
          { opacity: 0.12, scaleX: 1, y: -3 },
          0,
        );
    });

    media.add("(max-width: 767px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "center 58%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          frame,
          {
            y: 58,
            scale: 0.84,
            rotationX: 10,
            borderRadius: "24px 24px 32px 32px",
          },
          {
            y: -4,
            scale: 1,
            rotationX: 0,
            borderRadius: "24px 24px 10px 10px",
          },
          0,
        )
        .fromTo(
          video,
          { scale: 0.98, yPercent: 2 },
          { scale: 1.045, yPercent: 0 },
          0,
        )
        .fromTo(
          shadow,
          { opacity: 0.34, scaleX: 0.58, y: 14 },
          { opacity: 0.1, scaleX: 0.94, y: 0 },
          0,
        );
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className="yl-demo-stage" aria-label="LearnNova landing page video preview">
      <div className="yl-demo-sticky">
        <div ref={glowRef} className="yl-demo-glow" aria-hidden="true" />
        <div ref={frameRef} className="yl-demo-frame">
          <div className="yl-demo-viewport">
            <video
              ref={videoRef}
              className="yl-demo-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/landing-page-video-poster.jpg"
              aria-label="LearnNova product tour"
            >
              <source src={LANDING_PAGE_VIDEO} type="video/mp4" />
              <source src="/landing-page-video.mp4" type="video/mp4" />
            </video>
            <div className="yl-demo-lens" aria-hidden="true" />
          </div>
        </div>
        <div ref={shadowRef} className="yl-demo-shadow" aria-hidden="true" />
      </div>
    </section>
  );
}
