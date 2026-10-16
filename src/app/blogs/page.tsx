"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Sparkles, 
  Bookmark, 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  X
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      keyPoint?: string;
    }[];
    conclusion: string;
  };
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "best-ai-study-tools-2026",
    title: "Best AI Study Tools for Students in 2026",
    date: "Mar 30, 2026",
    readTime: "6 min read",
    category: "AI Tools",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    excerpt: "A comprehensive breakdown of top AI tools transforming academic learning, from autonomous tutors to intelligent lecture processors.",
    content: {
      intro: "In 2026, artificial intelligence has shifted from generic text completion into context-aware, multimodal study partners. Students are no longer just looking up answers; they are using AI to model deep conceptual understanding.",
      sections: [
        {
          heading: "1. YouLearn: The Ultimate Personalized AI Tutor",
          body: [
            "YouLearn stands apart by converting your raw syllabus materials—YouTube lectures, 100-page slide decks, textbook PDFs, and recorded seminars—into an active study workspace.",
            "Instead of merely regurgitating summaries, YouLearn generates flashcard decks with spaced repetition, builds practice exams calibrated to your syllabus, and hosts an AI tutor who cross-references every claim with exact citations in your source file."
          ],
          keyPoint: "Best for: Students taking rigorous STEM, medical, or humanities courses who want everything grounded in their professor's material."
        },
        {
          heading: "2. Multimodal Lecture Transcription Engines",
          body: [
            "Modern note-taking tools now process speaker intonations, whiteboard handwriting, and slide transitions simultaneously.",
            "Having high-fidelity transcripts allows you to search for exact phrases spoken by your lecturer weeks before exam day."
          ]
        },
        {
          heading: "3. Adaptive Flashcard & Spaced Repetition Systems",
          body: [
            "Static flashcards often fail because students waste time reviewing concepts they already know. Modern AI algorithms evaluate your recall latency and schedule reviews dynamically.",
            "Combining AI flashcard generation with spaced repetition can cut test preparation time in half while doubling 30-day retention."
          ]
        }
      ],
      conclusion: "Choosing the right AI study stack is about finding tools that foster active recall rather than passive consumption. Platforms like YouLearn ensure you stay in the driver's seat of your own education."
    }
  },
  {
    id: "best-ai-tutor-apps-college",
    title: "Best AI Tutor Apps for College Students in 2026",
    date: "Mar 30, 2026",
    readTime: "5 min read",
    category: "College Life",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    excerpt: "Navigating university coursework with an AI tutor that simulates a private 1-on-1 professor at your desk.",
    content: {
      intro: "College office hours are limited to an hour or two a week. What happens when you are stuck on an algorithmic proof or organic synthesis pathway at 11:30 PM? AI tutors have filled this gap.",
      sections: [
        {
          heading: "Why Standard ChatGPT Isn't Enough for College",
          body: [
            "Generic LLMs tend to give the direct answer away immediately. In college exams, having the answer without understanding the underlying derivation guarantees failure on modified questions.",
            "An effective AI tutor uses the Socratic method: asking probing questions, pointing out conceptual gaps, and prompting you to take the next deductive step."
          ],
          keyPoint: "Active learning outperforms passive answer retrieval by up to 2.5x in standardized college assessment benchmarks."
        },
        {
          heading: "Grounding Answers in Your Class Slides",
          body: [
            "Different professors emphasize different conventions. A good AI tutor allows you to upload the specific syllabus and lecture slides so its answers adhere to your course's required notation."
          ]
        }
      ],
      conclusion: "An AI tutor should feel like having Aristotle or Richard Feynman sitting beside you in the campus library, patiently guiding your thought process."
    }
  },
  {
    id: "best-youtube-summarizer-students",
    title: "Best YouTube Video Summarizer Tools for Students in 2026",
    date: "Mar 30, 2026",
    readTime: "7 min read",
    category: "AI Tools",
    imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=600&q=80",
    excerpt: "Turn 2-hour recorded university lectures and video tutorials into digestible chapter notes and self-assessment quizzes.",
    content: {
      intro: "University lectures, MIT OpenCourseWare videos, and CrashCourse playlists contain world-class knowledge, but sitting through 90 minutes of video just to find one 4-minute explanation is deeply inefficient.",
      sections: [
        {
          heading: "Timestamped Concept Mapping",
          body: [
            "Top-tier video summarizers break long lectures down into discrete conceptual modules with exact clickable timestamps.",
            "YouLearn's YouTube integration not only transcribes the speech but extracts formulas written on the blackboard and compiles them into downloadable cheat sheets."
          ]
        },
        {
          heading: "From Video to Instant Quiz",
          body: [
            "Once you finish a chapter, testing yourself immediately cements the neural pathways. Modern tools let you generate a 5-question multiple-choice quiz directly from the YouTube audio stream."
          ],
          keyPoint: "Tip: Watch the lecture at 1.5x speed, then review the YouLearn AI generated chapter summary to solidify your recall."
        }
      ],
      conclusion: "Never re-watch an entire lecture to find a single definition again. Use intelligent video summarizers to extract high-yield insights in seconds."
    }
  },
  {
    id: "how-to-summarize-lecture-recordings",
    title: "How to Summarize Lecture Recordings and Slides with AI",
    date: "Mar 30, 2026",
    readTime: "4 min read",
    category: "Study Tips",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    excerpt: "Step-by-step framework to convert unstructured professor lectures and 200-slide PDFs into concise, test-ready revision notes.",
    content: {
      intro: "Students are drowning in content: weekly lecture recordings, assigned textbook chapters, and massive PowerPoint decks. Here is the exact systematic workflow top students use to distill this noise into A-grade study materials.",
      sections: [
        {
          heading: "Step 1: The Multi-Format Ingestion Strategy",
          body: [
            "Combine your slides with the audio transcript. Slides alone lack verbal context, and transcripts alone lack visual charts and diagrams.",
            "YouLearn allows simultaneous upload of both media formats, automatically linking spoken explanations to their corresponding slide numbers."
          ]
        },
        {
          heading: "Step 2: Generating Active Summary Headers",
          body: [
            "Avoid wall-of-text summaries. Format notes around high-yield questions, definitions, and contrasting concepts.",
            "Use bullet points with bold keywords and concise definitions that you can review 24 hours before your midterms."
          ]
        }
      ],
      conclusion: "By treating lectures as raw data and AI as your organizing engine, you convert hours of passive listening into focused, high-impact mastery."
    }
  },
  {
    id: "best-ai-flashcard-makers-2026",
    title: "Best AI Flashcard Makers and Quiz Generators for Studying in 2026",
    date: "Mar 30, 2026",
    readTime: "5 min read",
    category: "Study Tips",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    excerpt: "Stop spending 3 hours manually typing Anki cards. Let AI parse your textbooks and create active recall decks automatically.",
    content: {
      intro: "Every cognitive science study agrees: active recall combined with spaced repetition is the single most effective way to retain information for high-stakes examinations.",
      sections: [
        {
          heading: "The Problem with Manual Card Creation",
          body: [
            "Students often spend 80% of their study time copying and pasting terms into flashcard software, leaving only 20% for actual review.",
            "AI flashcard generators flip this ratio: upload your PDF, and get 40 high-yield cards in 10 seconds, allowing you to spend 95% of your time testing your recall."
          ]
        },
        {
          heading: "Why Context-Aware Cards Win",
          body: [
            "Good flashcards don't just ask for a vocabulary definition—they test application, edge cases, and cause-and-effect relationships."
          ]
        }
      ],
      conclusion: "Automate card synthesis so you can focus 100% of your cognitive energy on retention and mastery."
    }
  },
  {
    id: "turn-class-notes-into-podcasts",
    title: "Turn Your Class Notes Into Podcasts and Audio Study Content with AI",
    date: "Mar 30, 2026",
    readTime: "6 min read",
    category: "Audio & Video",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    excerpt: "Transform dry textbook chapters into engaging conversational audio dialogues you can listen to while walking, commuting, or at the gym.",
    content: {
      intro: "Auditory learners and busy students with long commutes often struggle to find time for stationary desk studying. YouLearn's AI Podcast feature turns any study document into a two-host dialogue.",
      sections: [
        {
          heading: "The Science of Audio Priming",
          body: [
            "Listening to an engaging discussion of a topic before sitting down to read the dense textbook primes your brain to recognize key themes and vocabulary.",
            "Two conversational hosts debating concepts provides cognitive contrast, making abstract theories far easier to visualize and remember."
          ]
        },
        {
          heading: "How YouLearn Generates Study Audio",
          body: [
            "Select any ingested lecture or document in YouLearn, switch to 'AI Podcast' mode, and listen to a tailored 5-15 minute breakdown with interactive transcript synchronization."
          ]
        }
      ],
      conclusion: "Reclaim lost hours during your daily transit and turn everyday downtime into effortless academic progress."
    }
  },
  {
    id: "best-ai-tools-for-medical-students",
    title: "Best AI Tools for Medical Students in 2026: Study Smarter for Boards and Beyond",
    date: "Mar 30, 2026",
    readTime: "8 min read",
    category: "AI Tools",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    excerpt: "How medical students are conquering USMLE Step 1 & 2, pharmacology pathways, and clinical case studies using AI.",
    content: {
      intro: "Medical school presents a cognitive volume unmatched by almost any other graduate program. Retaining thousands of pathologies, drug interactions, and biochemical pathways requires precision tooling.",
      sections: [
        {
          heading: "Clinical Case Simulation with AI",
          body: [
            "Rather than merely memorizing First Aid tables, modern med students use AI tutors to generate synthetic patient presentations.",
            "The AI presents chief complaints, lab values, and vitals, prompting the student to justify their differential diagnosis and treatment protocol."
          ]
        },
        {
          heading: "Vetting for Accuracy and Citations",
          body: [
            "Hallucinations in medicine are unacceptable. YouLearn's document-grounded model ensures that every diagnostic criterion links directly to verified medical texts and lecture syllabi."
          ]
        }
      ],
      conclusion: "With the right AI study framework, medical students can master complex physiological systems without burning out."
    }
  },
  {
    id: "youlearn-vs-chatgpt-for-studying",
    title: "YouLearn vs ChatGPT for Studying: Which Is Better for Exam Prep?",
    date: "Mar 30, 2026",
    readTime: "5 min read",
    category: "AI Tools",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    excerpt: "A direct head-to-head comparison between general-purpose chatbots and a dedicated student-first AI tutor platform.",
    content: {
      intro: "Almost every student has used ChatGPT to answer a homework question. But when finals arrive, is a generic chat interface the best tool to prepare you for a 3-hour exam?",
      sections: [
        {
          heading: "Feature Breakdown: General LLM vs YouLearn",
          body: [
            "ChatGPT operates in a vacuum: you copy-paste text chunks, and its memory resets between long sessions.",
            "YouLearn is built around full course spaces: it maintains your notes, generated flashcards, practice exam history, and audio podcasts in one unified dashboard."
          ],
          keyPoint: "YouLearn acts as an educational operating system, whereas generic chatbots are single-turn chat windows."
        },
        {
          heading: "Grounded Citations vs Hallucinations",
          body: [
            "YouLearn's AI tutor points you directly to page numbers and exact video timestamps, eliminating the guesswork of whether an answer was hallucinated."
          ]
        }
      ],
      conclusion: "While ChatGPT is great for casual queries, serious academic excellence demands a dedicated learning environment like YouLearn."
    }
  },
  {
    id: "how-to-study-effectively-with-ai",
    title: "How to Study Effectively with AI: Science-Backed Methods That Actually Work",
    date: "Mar 30, 2026",
    readTime: "6 min read",
    category: "Study Tips",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    excerpt: "Learn cognitive psychology principles like the testing effect, dual coding, and the Feynman technique implemented through AI.",
    content: {
      intro: "AI can either make you a passive learner or an academic powerhouse. The difference lies entirely in your study methodology.",
      sections: [
        {
          heading: "The Feynman Technique with an AI Partner",
          body: [
            "Explain a complex topic to the AI in simple terms as if teaching a beginner. Instruct the AI: 'Challenge me on any logical leaps or vague terminology.'",
            "This forces you to confront the illusion of explanatory depth, exposing precisely where your understanding breaks down."
          ]
        },
        {
          heading: "The Testing Effect",
          body: [
            "Taking a low-stakes practice exam produces significantly stronger memory consolidation than re-reading the textbook chapter three times."
          ]
        }
      ],
      conclusion: "Harness AI as an intellectual sparring partner to unlock genuine, lifelong conceptual mastery."
    }
  },
  {
    id: "what-is-an-ai-tutor-2026",
    title: "What Is an AI Tutor? How AI Study Tutors Work in 2026",
    date: "Mar 29, 2026",
    readTime: "5 min read",
    category: "AI Tools",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
    excerpt: "Understanding the architecture, capabilities, and pedagogical philosophy behind modern autonomous AI study assistants.",
    content: {
      intro: "In 1984, educational psychologist Benjamin Bloom published his famous '2 Sigma Problem': students tutored one-on-one scored two standard deviations higher than students in conventional classrooms. For four decades, 1-on-1 tutoring was too expensive for the masses. In 2026, AI has solved Bloom's 2 Sigma Problem.",
      sections: [
        {
          heading: "Beyond Autocomplete: Pedagogical AI",
          body: [
            "A true AI tutor is programmed with pedagogical constraints: it assesses your prior knowledge, identifies misconceptions, provides scaffolding, and gradually removes hints as your confidence grows."
          ]
        },
        {
          heading: "Multi-Modal Context Windows",
          body: [
            "Modern AI tutors can read hand-drawn circuit diagrams, chemical structures, and mathematical proofs, engaging with your actual homework worksheets."
          ]
        }
      ],
      conclusion: "The democratization of 1-on-1 personalized tutoring is the most significant educational breakthrough of our generation."
    }
  },
  {
    id: "30-practical-tips-college",
    title: "30+ Practical Tips On How To Study Better In College",
    date: "Oct 1, 2024",
    readTime: "10 min read",
    category: "College Life",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    excerpt: "Battle-tested habits for managing heavy course loads, conquering exam anxiety, and maintaining a healthy work-life balance.",
    content: {
      intro: "Transitioning to college can feel overwhelming. Here are 30 actionable, realistic study tips from students who maintained a 4.0 GPA while staying healthy and involved on campus.",
      sections: [
        {
          heading: "Time Management & Environment",
          body: [
            "1. Protect your prime hours: If you focus best from 9-11 AM, schedule your hardest problem sets then.",
            "2. Establish dedicated study zones: Never study in your bed. Train your brain that your desk is exclusively for focus.",
            "3. Timebox with the Pomodoro technique: 25 minutes of intense focus followed by a strict 5-minute break."
          ]
        },
        {
          heading: "Exam Week Strategy",
          body: [
            "1. Start review 10 days out, not 48 hours prior.",
            "2. Prioritize past exam papers over re-reading textbooks.",
            "3. Sleep 7.5 hours the night before the exam—sleep consolidates memory."
          ]
        }
      ],
      conclusion: "Consistency beats cramming every single time. Small daily habits create extraordinary semester results."
    }
  },
  {
    id: "7-best-active-study-methods",
    title: "7 Best Active Study Methods That Actually Work",
    date: "Sep 26, 2024",
    readTime: "6 min read",
    category: "Study Tips",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    excerpt: "Ditch passive re-reading and highlighters. Here are the 7 empirically verified study techniques that lead to top grades.",
    content: {
      intro: "Highlighting lines in a textbook and re-reading notes feel productive, but cognitive research shows they provide near-zero long-term retention. Here are 7 active study methods backed by neuroscience.",
      sections: [
        {
          heading: "1. Blurting Method",
          body: [
            "Spend 10 minutes reading a section. Close the book, take a blank sheet of paper, and write down everything you remember. Compare with the source and highlight what you missed."
          ]
        },
        {
          heading: "2. The Cornell Note System with Active Recall",
          body: [
            "Divide your page into notes and cue questions. Cover the notes column and try to answer your cue questions purely from memory."
          ]
        },
        {
          heading: "3. Interleaved Practice",
          body: [
            "Mix different types of problem sets rather than doing 30 identical derivatives in a row. This trains your brain to select the correct strategy."
          ]
        }
      ],
      conclusion: "Active study creates initial cognitive friction, but that friction is the exact biological signal your brain requires to build permanent memories."
    }
  }
];

const CATEGORIES = ["All", "AI Tools", "Study Tips", "College Life", "Audio & Video"];

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (post: BlogPost) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="pt-12 pb-10 px-6 max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 mb-3">
            Blogs
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-[540px] mx-auto">
            Insights on AI tutoring, active recall study methods, and how the world&apos;s best students learn faster.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles, study tools, college tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 bg-neutral-50/70 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Post List matching exact YouLearn layout */}
        <section className="max-w-[760px] mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200/60 p-8">
              <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-neutral-800">No articles found</h3>
              <p className="text-sm text-neutral-500 mt-1">
                Try searching for something else or reset your filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-full hover:bg-neutral-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group py-6 sm:py-7 flex items-start gap-4 sm:gap-6 cursor-pointer hover:bg-neutral-50/70 p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl transition-all duration-150"
                >
                  {/* Left: Thumbnail Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-xs">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 sm:hidden bg-neutral-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-full font-medium">
                      {post.category}
                    </div>
                  </div>

                  {/* Right: Title & Metadata */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 pt-0.5 sm:pt-1">
                    <div className="hidden sm:flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {post.category}
                      </span>
                      <span className="text-[12px] text-neutral-400">•</span>
                      <span className="text-[12px] text-neutral-400 font-medium">{post.readTime}</span>
                    </div>

                    <h2 className="text-lg sm:text-[21px] font-bold text-neutral-950 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="hidden sm:block text-sm text-neutral-500 mt-2 line-clamp-2 font-normal leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 mt-2 sm:mt-2.5 text-xs text-neutral-400 font-medium">
                      <span>{post.date}</span>
                      <span className="sm:hidden">• {post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Newsletter & Study CTA Banner */}
        <section className="max-w-[760px] mx-auto px-6 mt-16">
          <div className="bg-linear-to-b from-neutral-900 to-black text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-4 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Level up your grades</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Study your own material with AI
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-[500px] mb-6">
                Upload your lecture videos, syllabus slides, and notes into YouLearn. Chat with an AI tutor trained on your exact classes.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/signin"
                  className="w-full sm:w-auto px-6 py-3 bg-white text-neutral-950 hover:bg-neutral-100 rounded-full font-semibold text-sm transition-all text-center shadow-md active:scale-95"
                >
                  Try YouLearn Free
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium text-sm transition-all text-center"
                >
                  View Plans &amp; Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Full Article Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-[820px] max-h-[92vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-20">
              <button
                onClick={() => setActivePost(null)}
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blogs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activePost)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors relative"
                  title="Share article"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink && (
                    <span className="absolute -bottom-8 right-0 text-[11px] bg-neutral-900 text-white px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
              {/* Meta & Category */}
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-3">
                  <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold uppercase tracking-wider text-[10px]">
                    {activePost.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {activePost.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {activePost.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  {activePost.title}
                </h1>
              </div>

              {/* Cover Image */}
              <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                <img
                  src={activePost.imageUrl}
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Intro Text */}
              <p className="text-lg sm:text-xl text-neutral-700 font-medium leading-relaxed border-l-4 border-neutral-950 pl-4 py-1 italic bg-neutral-50/50 rounded-r-xl">
                {activePost.content.intro}
              </p>

              {/* Structured Sections */}
              <div className="space-y-8 text-neutral-800 leading-relaxed">
                {activePost.content.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-950">
                      {section.heading}
                    </h3>
                    {section.body.map((p, pIdx) => (
                      <p key={pIdx} className="text-base text-neutral-700 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.keyPoint && (
                      <div className="mt-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-blue-950">
                          {section.keyPoint}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Conclusion */}
                <div className="pt-6 border-t border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-950 mb-2">Key Takeaway</h4>
                  <p className="text-base text-neutral-700 leading-relaxed">
                    {activePost.content.conclusion}
                  </p>
                </div>
              </div>

              {/* Call to action inside reader */}
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">
                    Put this into practice with YouLearn
                  </h4>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Upload your class documents and let your personal AI tutor quiz you right now.
                  </p>
                </div>
                <Link
                  href="/app"
                  className="shrink-0 px-5 py-2.5 bg-neutral-950 text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
