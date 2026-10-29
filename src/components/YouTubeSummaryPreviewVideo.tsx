"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const YOUTUBE_SUMMARY_VIDEO =
  "https://learnnova.s3.us-east-1.amazonaws.com/yoytube_summary.mp4";

export function YouTubeSummaryPreviewVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
        .fromTo(video, { scale: 0.92, yPercent: 4 }, { scale: 1.06, yPercent: 0 }, 0)
        .fromTo(glow, { opacity: 0.35, scale: 0.68 }, { opacity: 1, scale: 1.08 }, 0)
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
        .fromTo(video, { scale: 0.98, yPercent: 2 }, { scale: 1.045, yPercent: 0 }, 0)
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
    <div
      ref={sectionRef}
      className="relative w-full py-5 [perspective:1700px] sm:py-6"
      aria-label="YouTube summaries product video"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-[15%_8%_7%] rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(116,218,187,0.16),transparent_42%),radial-gradient(circle_at_72%_36%,rgba(132,169,236,0.1),transparent_44%)] blur-[46px] will-change-[transform,opacity]"
        aria-hidden="true"
      />

      <div
        ref={frameRef}
        className="relative z-10 aspect-[1.78] w-full origin-bottom overflow-hidden rounded-t-[36px] rounded-b-[14px] border border-black/10 bg-white shadow-[0_2px_5px_rgba(19,23,21,0.08),0_26px_68px_rgba(19,26,23,0.14)] [transform-style:preserve-3d] [backface-visibility:hidden] will-change-[transform,border-radius]"
      >
        <video
          ref={videoRef}
          className="block h-full w-full object-cover [transform-origin:50%_48%] [backface-visibility:hidden] will-change-transform"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="YouTube summaries walkthrough"
        >
          <source src={YOUTUBE_SUMMARY_VIDEO} type="video/mp4" />
          <source src="/yoytube_summary.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        ref={shadowRef}
        className="pointer-events-none absolute z-0 right-[15%] bottom-[1%] left-[15%] h-[10%] rounded-full bg-[rgba(16,23,20,0.22)] blur-[36px] will-change-[transform,opacity]"
        aria-hidden="true"
      />
    </div>
  );
}
