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
      <span>learnnova.ai</span>
      <div className="yl-demo-browser-actions"><span>Product tour</span><MoreHorizontal /></div>
    </div>
  );
}

export function HeroProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const browser = browserRef.current;
    const viewport = viewportRef.current;
    const video = videoRef.current;
    const glow = glowRef.current;
    const shadow = shadowRef.current;
    if (!section || !frame || !browser || !viewport || !video || !glow || !shadow) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          end: "bottom 54%",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          frame,
          {
            y: 126,
            scaleX: 0.72,
            scaleY: 0.78,
            rotationX: 12,
            borderRadius: 36,
          },
          {
            y: -18,
            scaleX: 1.035,
            scaleY: 1.035,
            rotationX: 0,
            borderRadius: 14,
          },
          0,
        )
        .fromTo(
          viewport,
          { clipPath: "inset(5% 7% 7% 7% round 22px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
          0,
        )
        .fromTo(
          video,
          { scale: 0.96, yPercent: 3 },
          { scale: 1.075, yPercent: 0 },
          0,
        )
        .fromTo(
          browser,
          { opacity: 0.58, y: 5 },
          { opacity: 1, y: 0 },
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

    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: "bottom 64%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          frame,
          { y: 58, scale: 0.86, rotationX: 6, borderRadius: 22 },
          { y: -4, scale: 1, rotationX: 0, borderRadius: 12 },
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

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([frame, browser, viewport, video, glow, shadow], { clearProps: "all" });
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className="yl-demo-stage" aria-label="LearnNova landing page video preview">
      <div ref={glowRef} className="yl-demo-glow" aria-hidden="true" />
      <div ref={frameRef} className="yl-demo-frame">
        <div ref={browserRef}>
          <BrowserBar />
        </div>
        <div ref={viewportRef} className="yl-demo-viewport">
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
    </section>
  );
}
