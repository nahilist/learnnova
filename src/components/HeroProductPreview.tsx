"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Link2,
  Mic,
  MoreHorizontal,
  Pause,
  Plus,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroProductPreview.css";

const DEMO_INTERVAL_MS = 2800;

const spaces = [
  ["Human Behavioral Biology", "27 content", "warm"],
  ["Machine Learning", "26 content", "formula"],
  ["Intro to Psychology", "4 content", "waves"],
  ["Game Theory", "11 content", "chalk"],
  ["Intro to Sociology", "10 content", "color"],
] as const;

function BrowserBar() {
  return (
    <div className="yl-demo-browser" aria-hidden="true">
      <div className="yl-demo-dots"><i /><i /><i /></div>
      <span>The Genetic Code &amp; Translation.pdf</span>
      <div className="yl-demo-browser-actions"><span>Share</span><MoreHorizontal /></div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="yl-demo-sidebar" aria-hidden="true">
      <b><span>Y</span> YouLearn</b>
      <nav>
        <span><Plus /> Add content</span>
        <span><Search /> Search</span>
        <span><BookOpen /> History</span>
      </nav>
      <small>Recents</small>
      <nav>
        <span className="is-current"><i /> The Genetic Code &amp; Transl...</span>
        <span><FileText /> Machine Learning</span>
        <span><FileText /> Game Theory</span>
      </nav>
      <small>Spaces</small>
      <nav>
        <span><i className="purple" /> Human Behavioral Biology</span>
        <span><i className="blue" /> Machine Learning</span>
        <span><i className="yellow" /> Intro to Psychology</span>
      </nav>
      <em>Unlimited Plan</em>
    </aside>
  );
}

function ReaderScene() {
  return (
    <div className="yl-demo-reader">
      <article className="yl-demo-paper">
        <div className="yl-demo-paper-meta"><span>Chapter 11</span><span>The Genetic Code &amp; Translation</span><span>18</span></div>
        <h3>Summary</h3>
        <p>Information in the form of the linear order of bases is translated into sequences of amino acids according to the genetic code. The code uses triplet units that specify amino acids.</p>
        <p>Codons are deciphered by tRNA molecules, which act as adaptors between codons and amino acids. A tRNA carrying an amino acid is covalently attached to the 3&apos; end.</p>
        <p>The ribosome is a complex of one large and one small subunit, which consist of rRNAs and multiple proteins. Translation proceeds in a 5&apos;-to-3&apos; direction on the mRNA.</p>
        <p>After peptide bond formation, the ribosome moves one codon unit in the 3&apos; direction powered by elongation factors.</p>
      </article>
      <section className="yl-demo-podcast">
        <div className="yl-demo-tabs"><b>Chat</b><span>Flashcards</span><span>Quizzes</span><span className="active">Podcast</span><span>Summary</span></div>
        <h3>The Genetic Code and Translation</h3>
        <div className="yl-demo-player"><small>1:40 / 5:41</small><div><i /></div><button type="button" aria-label="Pause demo"><Pause /></button></div>
        <div className="yl-demo-podcast-tools"><span>Default</span><span>Hide Transcript</span><span>Auto Scroll</span></div>
        <div className="yl-demo-transcript">
          <small>Learnedia · 01:36</small>
          <p><b>Yes, perfect analogy.</b> They literally translate the language of DNA into the language of proteins. Some tRNAs can read multiple codes because of wobble.</p>
          <small>Charon · 01:49</small>
          <p>Wobble? That sounds made up.</p>
          <small>Learnedia · 01:51</small>
          <p>I know, right? But it&apos;s real. The third letter in the code can be flexible.</p>
        </div>
      </section>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="yl-demo-quick-actions">
      <div><Upload /><b>Upload</b><small>File, audio, video</small></div>
      <div><Link2 /><b>Paste</b><small>YouTube, website, text</small></div>
      <div><Mic /><b>Record</b><small>Record class, video call</small></div>
    </div>
  );
}

function SpaceCards({ compact = false }: { compact?: boolean }) {
  const visible = compact ? spaces.slice(0, 3) : spaces;
  return (
    <div className="yl-demo-space-grid">
      {visible.map(([title, count, theme]) => (
        <article className="yl-demo-space" key={title}>
          <div className={`yl-demo-space-art ${theme}`} />
          <b>{title}</b><small>{count}</small>
        </article>
      ))}
      {!compact && <article className="yl-demo-space create"><Plus /><span>Create Space</span></article>}
    </div>
  );
}

function LibraryScene() {
  return (
    <div className="yl-demo-shell">
      <Sidebar />
      <main className="yl-demo-library">
        <header><div><small>Good afternoon</small><h3>What do you want to learn?</h3></div><button type="button">New space <Plus /></button></header>
        <QuickActions />
        <div className="yl-demo-ask"><span>Learn anything</span><button type="button">↑</button></div>
        <div className="yl-demo-section-label"><b>My Spaces</b><span>Newest <ChevronDown /></span></div>
        <SpaceCards />
      </main>
    </div>
  );
}

function UploadScene() {
  return (
    <div className="yl-demo-shell">
      <Sidebar />
      <main className="yl-demo-upload">
        <div className="yl-demo-composer">
          <h3>What do you want to learn?</h3>
          <QuickActions />
          <div className="yl-demo-ask"><span>Learn anything</span><button type="button">↑</button></div>
        </div>
        <div className="yl-demo-section-label"><b>My Spaces</b><span>Newest <ChevronDown /></span></div>
        <SpaceCards compact />
      </main>
    </div>
  );
}

function DocumentScene() {
  return (
    <div className="yl-demo-shell">
      <Sidebar />
      <main className="yl-demo-document">
        <div className="yl-demo-doc-toolbar"><span>1 / 19</span><span>Page fit <ChevronDown /></span><span>Chat · Flashcards · Quizzes · Podcast · Summary</span></div>
        <div className="yl-demo-doc-grid">
          <article className="yl-demo-chapter">
            <div className="yl-demo-molecule"><i /><i /><i /></div>
            <strong>11</strong>
            <h3>The Genetic Code<br />&amp; Translation</h3>
            <hr />
            <div><b>Goal</b><p>At the heart of the central dogma is the concept that information in the four-letter alphabet of DNA is translated into a twenty-letter alphabet of proteins.</p></div>
          </article>
          <section className="yl-demo-learn"><Sparkles /><p>Learn with the AI Tutor</p><div><span>Quiz</span><span>Mind Map</span><span>Voice Mode</span></div></section>
        </div>
      </main>
    </div>
  );
}

const scenes = [ReaderScene, LibraryScene, UploadScene, DocumentScene];

export function HeroProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % scenes.length);
    }, DEMO_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

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
    <section ref={sectionRef} className="yl-demo-stage" aria-label="Animated preview of the YouLearn workspace">
      <div className="yl-demo-glow" aria-hidden="true" />
      <div ref={frameRef} className="yl-demo-frame">
        <BrowserBar />
        <div className="yl-demo-viewport">
          {scenes.map((Scene, index) => (
            <div className={`yl-demo-scene${activeScene === index ? " is-active" : ""}`} aria-hidden={activeScene !== index} key={index}>
              <Scene />
            </div>
          ))}
        </div>
      </div>
      <div ref={shadowRef} className="yl-demo-shadow" aria-hidden="true" />
    </section>
  );
}
