"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  Upload, 
  Sparkles, 
  ArrowLeft,
  HeartHandshake,
  Zap,
  Globe2
} from "lucide-react";

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  perks: string[];
}

const OPEN_ROLES: JobRole[] = [
  {
    id: "founding-engineer",
    title: "Founding Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "As a Founding Engineer at YouLearn, you will architect core real-time tutoring inference engines, multimodal document processing pipelines, and high-frequency student interactions scaled across 1.5M+ active users.",
    responsibilities: [
      "Design and deploy ultra-low-latency multimodal pipelines that parse audio, video, slides, and math equations.",
      "Work directly with the founders to build novel active-recall pedagogical workflows, spaced repetition engines, and automated quiz evaluation systems.",
      "Optimize LLM inference, embedding retrieval, and vector storage for sub-second Socratic tutoring responses.",
      "Scale our Next.js, Node.js, and Python infrastructure to handle rapid user growth during global exam seasons."
    ],
    qualifications: [
      "Demonstrated track record of shipping complex web applications and distributed systems from zero to one.",
      "Strong proficiency in TypeScript, React/Next.js, Python, PostgreSQL, and modern cloud deployment environments.",
      "Experience with LLM evaluation, retrieval-augmented generation (RAG), and prompt engineering.",
      "Obsessive focus on high polish, student user experience, and computational speed."
    ],
    perks: [
      "Substantial founding equity grant with competitive top-bracket salary.",
      "Full comprehensive health, dental, and vision insurance.",
      "Annual $5,000 learning stipend & unlimited access to state-of-the-art AI compute & research models.",
      "Flexible hybrid setup in our sunny San Francisco HQ with catered lunches and snacks."
    ]
  },
  {
    id: "ugc-creator",
    title: "UGC Creator",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "YouLearn is looking for a creative, relatable content creator to spearhead our TikTok, Instagram Reels, and YouTube Shorts presence. You will produce engaging student-first content that showcases how YouLearn transforms studying.",
    responsibilities: [
      "Ideate, script, film, and edit 4-6 high-performing short-form videos per week.",
      "Test viral hooks, study hacks, university exam reactions, and AI feature demonstrations.",
      "Engage directly with our student community in comments, Discord, and university campus ambassador circles.",
      "Analyze retention curves, engagement metrics, and conversion rates to refine creative formats."
    ],
    qualifications: [
      "Proven track record of growing short-form social accounts (TikTok/Reels/Shorts) with organic virality.",
      "Deep empathy for the struggles of modern high school and college students.",
      "Expertise in mobile video shooting, CapCut, Premiere Pro, or equivalent editing suites.",
      "High agency, creative curiosity, and the ability to turn dry study concepts into fun, viral content."
    ],
    perks: [
      "Competitive salary plus performance bonuses tied to viewership milestones.",
      "100% remote flexibility from anywhere in the world.",
      "Latest iPhone Pro and creator studio audio/lighting gear provided.",
      "Opportunity to shape the public voice and brand of an education platform reaching millions."
    ]
  },
  {
    id: "ai-product-designer",
    title: "AI Product Designer",
    department: "Design",
    location: "San Francisco, CA or Remote",
    type: "Full-time",
    description: "Reinvent what learning software feels like. Design intuitive, beautiful interfaces that turn complex multimodal AI interactions into delightful, effortless study habits.",
    responsibilities: [
      "Lead product design across our desktop web app, mobile apps, and browser extensions.",
      "Craft micro-interactions, responsive workspaces, and visual mental models for conversational AI tutoring.",
      "Conduct student user interviews to identify friction points during exam study sessions.",
      "Establish and maintain our evolving design system tokens, typography, and motion guidelines."
    ],
    qualifications: [
      "Strong portfolio demonstrating high-craft product design, typography, and interactive systems.",
      "Proficiency with Figma, modern prototyping tools, and working closely with engineers in code.",
      "Intuitive understanding of information hierarchy and cognitive load management.",
      "Passion for education and learning tools."
    ],
    perks: [
      "Competitive salary and meaningful equity.",
      "Generous hardware budget (M3 Max MacBook Pro + Apple Studio Display).",
      "Comprehensive healthcare and wellness benefits."
    ]
  },
  {
    id: "mobile-lead",
    title: "Mobile Lead (iOS & React Native)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Lead the development of YouLearn's mobile applications on iOS and Android, bringing the power of an AI tutor directly into students' pockets.",
    responsibilities: [
      "Architect and build our high-performance React Native / native iOS application.",
      "Implement offline flashcard caching, lock-screen widgets, and seamless background audio for AI podcasts.",
      "Optimize camera document scanning and voice-driven Socratic tutoring conversations.",
      "Maintain 99.9% crash-free sessions across hundreds of thousands of active devices."
    ],
    qualifications: [
      "4+ years of professional experience shipping consumer mobile apps on iOS/Android.",
      "Deep expertise in React Native, Swift, or native iOS development.",
      "Experience with background audio playback, push notifications, and local SQLite/WatermelonDB storage.",
      "Fastidious attention to mobile animation, gesture physics, and haptics."
    ],
    perks: [
      "Competitive compensation package with high equity upside.",
      "Work with a tight-knit, world-class team of passionate builders.",
      "Remote-first work environment with quarterly company offsites."
    ]
  }
];

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    portfolio: "",
    note: "",
    resumeAttached: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Content matching exact YouLearn Careers layout */}
      <main className="flex-1 pb-24">
        <div className="max-w-[760px] mx-auto px-6 pt-16 sm:pt-20">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-[44px] font-extrabold tracking-tight text-neutral-950 mb-8">
            Careers
          </h1>

          {/* Mission Copy from original screenshot */}
          <div className="space-y-6 text-neutral-600 text-base sm:text-[17px] leading-relaxed font-normal">
            <p>
              YouLearn is an AI tutor personalized to each student.
            </p>
            <p>
              So far, we&apos;ve grown YouLearn to over 1.5 million users, turning learning materials into concise notes, an AI tutor you can talk to, and personalized tests.
            </p>
            <p>
              But that&apos;s just the beginning. Our ultimate goal is to build a personalized AI tutor for everyone. Think of it as your personal &ldquo;Aristotle,&rdquo; a lifelong tutor that grows with you.
            </p>
            <p>
              We&apos;re building the future of education, one student, one question, one step at a time.
            </p>
            <p className="text-neutral-900 font-medium">
              If you&apos;re excited to shape how the world learns, join us.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-neutral-200/80 my-12" />

          {/* Open Roles List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Open Roles</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
                {OPEN_ROLES.length} Positions Available
              </span>
            </div>

            <div className="divide-y divide-neutral-100 border border-neutral-200/70 rounded-2xl overflow-hidden shadow-xs">
              {OPEN_ROLES.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setSubmitted(false);
                  }}
                  className="group p-5 sm:p-6 flex items-center justify-between hover:bg-neutral-50/80 cursor-pointer transition-all duration-150"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-neutral-950 group-hover:text-blue-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-normal">
                      {role.department} • {role.location} • {role.type}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 group-hover:bg-neutral-200/50 transition-all">
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture & Values Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-neutral-200/70">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">High Agency</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Small team, immense ownership. We ship daily and measure success through real student mastery.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Student Obsessed</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Everything we build starts with students studying at 2 AM trying to pass organic chemistry or linear algebra.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Global Reach</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Over 1.5M students across 140+ countries rely on YouLearn to understand their coursework.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Role Details & Application Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-[780px] max-h-[92vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-20">
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-950"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Positions</span>
              </button>

              <button
                onClick={() => setSelectedRole(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              {!submitted ? (
                <>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {selectedRole.department}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedRole.location}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedRole.type}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                      {selectedRole.title}
                    </h2>

                    <p className="text-base text-neutral-600 mt-3 leading-relaxed">
                      {selectedRole.description}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-neutral-900">What You&apos;ll Do</h3>
                    <ul className="space-y-2">
                      {selectedRole.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qualifications */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-neutral-900">What We Look For</h3>
                    <ul className="space-y-2">
                      {selectedRole.qualifications.map((qual, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Perks */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Benefits &amp; Perks
                    </h3>
                    <ul className="space-y-1.5">
                      {selectedRole.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Application Form */}
                  <div className="pt-4 border-t border-neutral-100">
                    <h3 className="text-xl font-bold text-neutral-950 mb-4">Apply for this role</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Alex Morgan"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="alex@stanford.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            LinkedIn / GitHub URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/alex"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Portfolio or Past Project Link
                          </label>
                          <input
                            type="url"
                            placeholder="https://alexmorgan.dev"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Why are you excited to build YouLearn?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell us about a learning problem you've faced or an educational tool you love..."
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                        />
                      </div>

                      {/* Resume Upload Simulator */}
                      <div 
                        onClick={() => setFormData({ ...formData, resumeAttached: true })}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                          formData.resumeAttached 
                            ? "border-emerald-500 bg-emerald-50/50" 
                            : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/50"
                        }`}
                      >
                        <Upload className={`w-5 h-5 mx-auto mb-1 ${formData.resumeAttached ? "text-emerald-600" : "text-neutral-400"}`} />
                        <span className="text-xs font-medium text-neutral-700 block">
                          {formData.resumeAttached ? "✓ resume_alex_morgan_2026.pdf attached" : "Attach Resume / CV (PDF or DOCX)"}
                        </span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          Click to upload (simulated for demo)
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-semibold text-sm transition-all shadow-md active:scale-98"
                      >
                        Submit Application
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in-75 duration-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-950">Application Received!</h3>
                  <p className="text-sm text-neutral-600 max-w-[450px] mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-neutral-900">{formData.name || "friend"}</span>. Our founding team has received your application for <span className="font-semibold text-neutral-900">{selectedRole.title}</span>. We will review your materials and respond to <span className="font-semibold text-neutral-900">{formData.email || "your email"}</span> within 48 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
