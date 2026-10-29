/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClosingCta } from "@/components/ClosingCta";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  ArrowRight,
  CheckCircle2,
  X
} from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  readTime: string;
  category: string;
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

export const BLOG_POSTS: BlogPost[] = [
  {
    "id": "best-ai-study-tools-students-2026",
    "slug": "best-ai-study-tools-students-2026",
    "title": "Best AI Study Tools for Students in 2026",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/jDzS22EDJWuREbkvanaadyZpzM.jpg?width=3816&height=2544",
    "readTime": "6 min read",
    "category": "AI Tools",
    "content": {
      "intro": "In 2026, artificial intelligence has shifted from generic text completion into context-aware, multimodal study partners. Students are no longer just looking up answers; they are using AI to model deep conceptual understanding.",
      "sections": [
        {
          "heading": "1. YouLearn: The Ultimate Personalized AI Tutor",
          "body": [
            "YouLearn stands apart by converting your raw syllabus materials\u2014YouTube lectures, 100-page slide decks, textbook PDFs, and recorded seminars\u2014into an active study workspace.",
            "Instead of merely regurgitating summaries, YouLearn generates flashcard decks with spaced repetition, builds practice exams calibrated to your syllabus, and hosts an AI tutor who cross-references every claim with exact citations in your source file."
          ],
          "keyPoint": "Best for: Students taking rigorous STEM, medical, or humanities courses who want everything grounded in their professor's material."
        },
        {
          "heading": "2. Multimodal Lecture Transcription Engines",
          "body": [
            "Modern note-taking tools now process speaker intonations, whiteboard handwriting, and slide transitions simultaneously.",
            "Having high-fidelity transcripts allows you to search for exact phrases spoken by your lecturer weeks before exam day."
          ]
        },
        {
          "heading": "3. Adaptive Flashcard & Spaced Repetition Systems",
          "body": [
            "Static flashcards often fail because students waste time reviewing concepts they already know. Modern AI algorithms evaluate your recall latency and schedule reviews dynamically.",
            "Combining AI flashcard generation with spaced repetition can cut test preparation time in half while doubling 30-day retention."
          ]
        }
      ],
      "conclusion": "Choosing the right AI study stack is about finding tools that foster active recall rather than passive consumption. Platforms like YouLearn ensure you stay in the driver's seat of your own education."
    }
  },
  {
    "id": "best-ai-tutor-apps-college-students-2026",
    "slug": "best-ai-tutor-apps-college-students-2026",
    "title": "Best AI Tutor Apps for College Students in 2026",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/zb6wTf6j7H1Xr17r0ozQ3FePIuE.jpg?width=4272&height=2848",
    "readTime": "5 min read",
    "category": "College Life",
    "content": {
      "intro": "College office hours are limited to an hour or two a week. What happens when you are stuck on an algorithmic proof or organic synthesis pathway at 11:30 PM? AI tutors have filled this gap.",
      "sections": [
        {
          "heading": "Why Standard ChatGPT Isn't Enough for College",
          "body": [
            "Generic LLMs tend to give the direct answer away immediately. In college exams, having the answer without understanding the underlying derivation guarantees failure on modified questions.",
            "An effective AI tutor uses the Socratic method: asking probing questions, pointing out conceptual gaps, and prompting you to take the next deductive step."
          ],
          "keyPoint": "Active learning outperforms passive answer retrieval by up to 2.5x in standardized college assessment benchmarks."
        },
        {
          "heading": "Grounding Answers in Your Class Slides",
          "body": [
            "Different professors emphasize different conventions. A good AI tutor allows you to upload the specific syllabus and lecture slides so its answers adhere to your course's required notation."
          ]
        }
      ],
      "conclusion": "An AI tutor should feel like having Aristotle or Richard Feynman sitting beside you in the campus library, patiently guiding your thought process."
    }
  },
  {
    "id": "best-youtube-video-summarizer-tools-for-students-in-2026",
    "slug": "best-youtube-video-summarizer-tools-for-students-in-2026",
    "title": "Best YouTube Video Summarizer Tools for Students in 2026",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/mupDeqVbgdBfGex5DiS9s2duKA.jpg?width=6016&height=4016",
    "readTime": "7 min read",
    "category": "AI Tools",
    "content": {
      "intro": "University lectures, MIT OpenCourseWare videos, and CrashCourse playlists contain world-class knowledge, but sitting through 90 minutes of video just to find one 4-minute explanation is deeply inefficient.",
      "sections": [
        {
          "heading": "Timestamped Concept Mapping",
          "body": [
            "Top-tier video summarizers break long lectures down into discrete conceptual modules with exact clickable timestamps.",
            "YouLearn's YouTube integration not only transcribes the speech but extracts formulas written on the blackboard and compiles them into downloadable cheat sheets."
          ]
        },
        {
          "heading": "From Video to Instant Quiz",
          "body": [
            "Once you finish a chapter, testing yourself immediately cements the neural pathways. Modern tools let you generate a 5-question multiple-choice quiz directly from the YouTube audio stream."
          ],
          "keyPoint": "Tip: Watch the lecture at 1.5x speed, then review the YouLearn AI generated chapter summary to solidify your recall."
        }
      ],
      "conclusion": "Never re-watch an entire lecture to find a single definition again. Use intelligent video summarizers to extract high-yield insights in seconds."
    }
  },
  {
    "id": "how-to-summarize-lecture-recordings-and-slides-with-ai",
    "slug": "how-to-summarize-lecture-recordings-and-slides-with-ai",
    "title": "How to Summarize Lecture Recordings and Slides with AI",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/iKr1ZoFZeJ2T8GDS6lwnhjzY4RI.jpg?width=5444&height=3649",
    "readTime": "4 min read",
    "category": "Study Tips",
    "content": {
      "intro": "Students are drowning in content: weekly lecture recordings, assigned textbook chapters, and massive PowerPoint decks. Here is the exact systematic workflow top students use to distill this noise into A-grade study materials.",
      "sections": [
        {
          "heading": "Step 1: The Multi-Format Ingestion Strategy",
          "body": [
            "Combine your slides with the audio transcript. Slides alone lack verbal context, and transcripts alone lack visual charts and diagrams.",
            "YouLearn allows simultaneous upload of both media formats, automatically linking spoken explanations to their corresponding slide numbers."
          ]
        },
        {
          "heading": "Step 2: Generating Active Summary Headers",
          "body": [
            "Avoid wall-of-text summaries. Format notes around high-yield questions, definitions, and contrasting concepts.",
            "Use bullet points with bold keywords and concise definitions that you can review 24 hours before your midterms."
          ]
        }
      ],
      "conclusion": "By treating lectures as raw data and AI as your organizing engine, you convert hours of passive listening into focused, high-impact mastery."
    }
  },
  {
    "id": "best-ai-flashcard-makers-quiz-generators-studying",
    "slug": "best-ai-flashcard-makers-quiz-generators-studying",
    "title": "Best AI Flashcard Makers and Quiz Generators for Studying in 2026",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/WGBFdfKPRAPsGJxk6ECVkaISWXU.jpg?width=4032&height=2519",
    "readTime": "5 min read",
    "category": "Study Tips",
    "content": {
      "intro": "Every cognitive science study agrees: active recall combined with spaced repetition is the single most effective way to retain information for high-stakes examinations.",
      "sections": [
        {
          "heading": "The Problem with Manual Card Creation",
          "body": [
            "Students often spend 80% of their study time copying and pasting terms into flashcard software, leaving only 20% for actual review.",
            "AI flashcard generators flip this ratio: upload your PDF, and get 40 high-yield cards in 10 seconds, allowing you to spend 95% of your time testing your recall."
          ]
        },
        {
          "heading": "Why Context-Aware Cards Win",
          "body": [
            "Good flashcards don't just ask for a vocabulary definition\u2014they test application, edge cases, and cause-and-effect relationships."
          ]
        }
      ],
      "conclusion": "Automate card synthesis so you can focus 100% of your cognitive energy on retention and mastery."
    }
  },
  {
    "id": "turn-class-notes-into-podcasts-audio-study-content-ai",
    "slug": "turn-class-notes-into-podcasts-audio-study-content-ai",
    "title": "Turn Your Class Notes Into Podcasts and Audio Study Content with AI",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/8GggIuQeY6iIgXcne7Qxnw68QrM.jpg?width=6461&height=4307",
    "readTime": "6 min read",
    "category": "Audio & Video",
    "content": {
      "intro": "Auditory learners and busy students with long commutes often struggle to find time for stationary desk studying. YouLearn's AI Podcast feature turns any study document into a two-host dialogue.",
      "sections": [
        {
          "heading": "The Science of Audio Priming",
          "body": [
            "Listening to an engaging discussion of a topic before sitting down to read the dense textbook primes your brain to recognize key themes and vocabulary.",
            "Two conversational hosts debating concepts provides cognitive contrast, making abstract theories far easier to visualize and remember."
          ]
        },
        {
          "heading": "How YouLearn Generates Study Audio",
          "body": [
            "Select any ingested lecture or document in YouLearn, switch to 'AI Podcast' mode, and listen to a tailored 5-15 minute breakdown with interactive transcript synchronization."
          ]
        }
      ],
      "conclusion": "Reclaim lost hours during your daily transit and turn everyday downtime into effortless academic progress."
    }
  },
  {
    "id": "best-ai-tools-medical-students-2026",
    "slug": "best-ai-tools-medical-students-2026",
    "title": "Best AI Tools for Medical Students in 2026: Study Smarter for Boards and Beyond",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/kXs1bw4Bqf042LfjgXKy0XJARbI.jpg?width=5100&height=3400",
    "readTime": "8 min read",
    "category": "AI Tools",
    "content": {
      "intro": "Medical school presents a cognitive volume unmatched by almost any other graduate program. Retaining thousands of pathologies, drug interactions, and biochemical pathways requires precision tooling.",
      "sections": [
        {
          "heading": "Clinical Case Simulation with AI",
          "body": [
            "Rather than merely memorizing First Aid tables, modern med students use AI tutors to generate synthetic patient presentations.",
            "The AI presents chief complaints, lab values, and vitals, prompting the student to justify their differential diagnosis and treatment protocol."
          ]
        },
        {
          "heading": "Vetting for Accuracy and Citations",
          "body": [
            "Hallucinations in medicine are unacceptable. YouLearn's document-grounded model ensures that every diagnostic criterion links directly to verified medical texts and lecture syllabi."
          ]
        }
      ],
      "conclusion": "With the right AI study framework, medical students can master complex physiological systems without burning out."
    }
  },
  {
    "id": "youlearn-vs-chatgpt-for-studying",
    "slug": "youlearn-vs-chatgpt-for-studying",
    "title": "YouLearn vs ChatGPT for Studying: Which Is Better for Exam Prep?",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/x3Rbs4BQCb28CiTs0yhgi04.jpg?width=4247&height=2824",
    "readTime": "5 min read",
    "category": "AI Tools",
    "content": {
      "intro": "Almost every student has used ChatGPT to answer a homework question. But when finals arrive, is a generic chat interface the best tool to prepare you for a 3-hour exam?",
      "sections": [
        {
          "heading": "Feature Breakdown: General LLM vs YouLearn",
          "body": [
            "ChatGPT operates in a vacuum: you copy-paste text chunks, and its memory resets between long sessions.",
            "YouLearn is built around full course spaces: it maintains your notes, generated flashcards, practice exam history, and audio podcasts in one unified dashboard."
          ],
          "keyPoint": "YouLearn acts as an educational operating system, whereas generic chatbots are single-turn chat windows."
        },
        {
          "heading": "Grounded Citations vs Hallucinations",
          "body": [
            "YouLearn's AI tutor points you directly to page numbers and exact video timestamps, eliminating the guesswork of whether an answer was hallucinated."
          ]
        }
      ],
      "conclusion": "While ChatGPT is great for casual queries, serious academic excellence demands a dedicated learning environment like YouLearn."
    }
  },
  {
    "id": "how-to-study-effectively-with-ai",
    "slug": "how-to-study-effectively-with-ai",
    "title": "How to Study Effectively with AI: Science-Backed Methods That Actually Work",
    "date": "Mar 30, 2026",
    "imageUrl": "https://framerusercontent.com/images/Vs3C9P4FqhYITfAenFe29YKWWk.jpg?width=4500&height=3375",
    "readTime": "6 min read",
    "category": "Study Tips",
    "content": {
      "intro": "AI can either make you a passive learner or an academic powerhouse. The difference lies entirely in your study methodology.",
      "sections": [
        {
          "heading": "The Feynman Technique with an AI Partner",
          "body": [
            "Explain a complex topic to the AI in simple terms as if teaching a beginner. Instruct the AI: 'Challenge me on any logical leaps or vague terminology.'",
            "This forces you to confront the illusion of explanatory depth, exposing precisely where your understanding breaks down."
          ]
        },
        {
          "heading": "The Testing Effect",
          "body": [
            "Taking a low-stakes practice exam produces significantly stronger memory consolidation than re-reading the textbook chapter three times."
          ]
        }
      ],
      "conclusion": "Harness AI as an intellectual sparring partner to unlock genuine, lifelong conceptual mastery."
    }
  },
  {
    "id": "what-is-an-ai-tutor-how-ai-study-tutors-work",
    "slug": "what-is-an-ai-tutor-how-ai-study-tutors-work",
    "title": "What Is an AI Tutor? How AI Study Tutors Work in 2026",
    "date": "Mar 29, 2026",
    "imageUrl": "https://framerusercontent.com/images/ha6uRyxBwLZAnGC8qoimXibvVc.jpg?width=5353&height=3569",
    "readTime": "5 min read",
    "category": "AI Tools",
    "content": {
      "intro": "In 1984, educational psychologist Benjamin Bloom published his famous '2 Sigma Problem': students tutored one-on-one scored two standard deviations higher than students in conventional classrooms. For four decades, 1-on-1 tutoring was too expensive for the masses. In 2026, AI has solved Bloom's 2 Sigma Problem.",
      "sections": [
        {
          "heading": "Beyond Autocomplete: Pedagogical AI",
          "body": [
            "A true AI tutor is programmed with pedagogical constraints: it assesses your prior knowledge, identifies misconceptions, provides scaffolding, and gradually removes hints as your confidence grows."
          ]
        },
        {
          "heading": "Multi-Modal Context Windows",
          "body": [
            "Modern AI tutors can read hand-drawn circuit diagrams, chemical structures, and mathematical proofs, engaging with your actual homework worksheets."
          ]
        }
      ],
      "conclusion": "The democratization of 1-on-1 personalized tutoring is the most significant educational breakthrough of our generation."
    }
  },
  {
    "id": "how-to-turn-pdfs-into-flashcards-quizzes-study-notes-ai",
    "slug": "how-to-turn-pdfs-into-flashcards-quizzes-study-notes-ai",
    "title": "How to Turn PDFs Into Flashcards, Quizzes, and Study Notes with AI",
    "date": "Mar 29, 2026",
    "imageUrl": "https://framerusercontent.com/images/bh8wDIuuMpC8ZsGsaKD74AsFlY.jpg?width=4160&height=2340",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering how to turn pdfs into flashcards, quizzes, and study notes with ai is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-study-better-in-college",
    "slug": "how-to-study-better-in-college",
    "title": "30+ Practical Tips On How To Study Better In College",
    "date": "Oct 1, 2024",
    "imageUrl": "https://framerusercontent.com/images/chN4SELGtMKSfmdgZDwbTn5zOE.jpg?width=2400&height=1600",
    "readTime": "10 min read",
    "category": "College Life",
    "content": {
      "intro": "Transitioning to college can feel overwhelming. Here are 30 actionable, realistic study tips from students who maintained a 4.0 GPA while staying healthy and involved on campus.",
      "sections": [
        {
          "heading": "Time Management & Environment",
          "body": [
            "1. Protect your prime hours: If you focus best from 9-11 AM, schedule your hardest problem sets then.",
            "2. Establish dedicated study zones: Never study in your bed. Train your brain that your desk is exclusively for focus.",
            "3. Timebox with the Pomodoro technique: 25 minutes of intense focus followed by a strict 5-minute break."
          ]
        },
        {
          "heading": "Exam Week Strategy",
          "body": [
            "1. Start review 10 days out, not 48 hours prior.",
            "2. Prioritize past exam papers over re-reading textbooks.",
            "3. Sleep 7.5 hours the night before the exam\u2014sleep consolidates memory."
          ]
        }
      ],
      "conclusion": "Consistency beats cramming every single time. Small daily habits create extraordinary semester results."
    }
  },
  {
    "id": "how-to-pass-school",
    "slug": "how-to-pass-school",
    "title": "23 Tips On How To Pass School With Good Grades",
    "date": "Sep 30, 2024",
    "imageUrl": "https://framerusercontent.com/images/pTx6g4iurW0EjXOJD6Cp1KUu3g.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 23 tips on how to pass school with good grades is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "high-school-study-skills",
    "slug": "high-school-study-skills",
    "title": "12 Best High School Study Skills Every Student Must Have",
    "date": "Sep 29, 2024",
    "imageUrl": "https://framerusercontent.com/images/0oDJleieUMxz6UL5plV8R8favc.jpg?width=2400&height=1690",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 12 best high school study skills every student must have is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-study-by-yourself",
    "slug": "how-to-study-by-yourself",
    "title": "15 Tips On How To Study By Yourself And Get Good Grades",
    "date": "Sep 28, 2024",
    "imageUrl": "https://framerusercontent.com/images/QHVEANwLp3BVvz8Gw2GxR5gOBM.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 15 tips on how to study by yourself and get good grades is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "high-school-tips",
    "slug": "high-school-tips",
    "title": "31 Useful High School Tips Every Student Must Follow",
    "date": "Sep 26, 2024",
    "imageUrl": "https://framerusercontent.com/images/9drf7958nnUipNwrHGWDkPFkfg.jpg?width=2400&height=1754",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 31 useful high school tips every student must follow is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "active-study-methods",
    "slug": "active-study-methods",
    "title": "7 Best Active Study Methods That Actually Work",
    "date": "Sep 26, 2024",
    "imageUrl": "https://framerusercontent.com/images/esE68zpalU4ZIPszeYSg7iFrIlg.jpg?width=2400&height=1600",
    "readTime": "6 min read",
    "category": "Study Tips",
    "content": {
      "intro": "Highlighting lines in a textbook and re-reading notes feel productive, but cognitive research shows they provide near-zero long-term retention. Here are 7 active study methods backed by neuroscience.",
      "sections": [
        {
          "heading": "1. Blurting Method",
          "body": [
            "Spend 10 minutes reading a section. Close the book, take a blank sheet of paper, and write down everything you remember. Compare with the source and highlight what you missed."
          ]
        },
        {
          "heading": "2. The Cornell Note System with Active Recall",
          "body": [
            "Divide your page into notes and cue questions. Cover the notes column and try to answer your cue questions purely from memory."
          ]
        },
        {
          "heading": "3. Interleaved Practice",
          "body": [
            "Mix different types of problem sets rather than doing 30 identical derivatives in a row. This trains your brain to select the correct strategy."
          ]
        }
      ],
      "conclusion": "Active study creates initial cognitive friction, but that friction is the exact biological signal your brain requires to build permanent memories."
    }
  },
  {
    "id": "study-strategies-for-high-school-students",
    "slug": "study-strategies-for-high-school-students",
    "title": "12 Effective Study Strategies For High School Students",
    "date": "Sep 25, 2024",
    "imageUrl": "https://framerusercontent.com/images/0IhTFw9VhanP59cLR7f3hCtHA0.jpg?width=2400&height=1800",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 12 effective study strategies for high school students is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "best-study-method",
    "slug": "best-study-method",
    "title": "28 Best Study Methods and Tips For Acing Your Exams",
    "date": "Sep 24, 2024",
    "imageUrl": "https://framerusercontent.com/images/I7Bhx0yp5HTvD6PSkyAGmwIT4A.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 28 best study methods and tips for acing your exams is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "college-study-tips",
    "slug": "college-study-tips",
    "title": "11 Best College Study Tips Every Student Must Know",
    "date": "Sep 23, 2024",
    "imageUrl": "https://framerusercontent.com/images/Db79H2qT7h8qUFfiiVPw3IrTVs.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 11 best college study tips every student must know is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-do-good-in-school",
    "slug": "how-to-do-good-in-school",
    "title": "27 Tips On How To Do Good In School",
    "date": "Sep 22, 2024",
    "imageUrl": "https://framerusercontent.com/images/dKOZnaKAnsjBoA7774uOpAkZRQ.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 27 tips on how to do good in school is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "tips-for-school",
    "slug": "tips-for-school",
    "title": "Get Good Grades With These 24 Best Study Tips for School",
    "date": "Sep 21, 2024",
    "imageUrl": "https://framerusercontent.com/images/ahbV1r2wQU7kuRShXM997Imk.jpg?width=2400&height=1607",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering get good grades with these 24 best study tips for school is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-pass-a-test",
    "slug": "how-to-pass-a-test",
    "title": "15 Practical Tips On How To Pass A Test With Good Grades",
    "date": "Sep 20, 2024",
    "imageUrl": "https://framerusercontent.com/images/JVctcysHiALnREgaZw68PpUOJIE.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 15 practical tips on how to pass a test with good grades is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "back-to-school-tips",
    "slug": "back-to-school-tips",
    "title": "16 Back To School Tips Every Student Must Know About",
    "date": "Sep 19, 2024",
    "imageUrl": "https://framerusercontent.com/images/0oDJleieUMxz6UL5plV8R8favc.jpg?width=2400&height=1690",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 16 back to school tips every student must know about is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-be-a-good-student",
    "slug": "how-to-be-a-good-student",
    "title": "13 Practical Tips On How To Be A Good Student",
    "date": "Sep 18, 2024",
    "imageUrl": "https://framerusercontent.com/images/HXLBF00aS8h8f3tuzlB0WkRgc.jpg?width=2400&height=1998",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 13 practical tips on how to be a good student is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  },
  {
    "id": "how-to-be-a-better-student",
    "slug": "how-to-be-a-better-student",
    "title": "11 Tips On How To Be A Better Student",
    "date": "Sep 17, 2024",
    "imageUrl": "https://framerusercontent.com/images/cFupGRUkjkJjvaMNGxXhrucjVGM.jpg?width=2400&height=1600",
    "readTime": "5 min read",
    "category": "Study Guide",
    "content": {
      "intro": "In an increasingly demanding academic landscape, mastering 11 tips on how to be a better student is essential for high-performance learning and long-term memory retention.",
      "sections": [
        {
          "heading": "1. The Cognitive Foundation",
          "body": [
            "Effective studying is not about hours spent at a desk; it is about cognitive engagement. When students actively retrieve information, challenge their assumptions, and synthesize insights, memory consolidation occurs exponentially faster.",
            "Traditional passive review\u2014such as re-reading textbooks or highlighting lines\u2014creates an illusion of competence without genuine understanding."
          ],
          "keyPoint": "Active recall and spaced repetition consistently outperform passive review across empirical cognitive science benchmarks."
        },
        {
          "heading": "2. Modern AI-Assisted Implementation",
          "body": [
            "By leveraging intelligent study platforms like YouLearn, students can convert unstructured lecture slides, textbook PDFs, and video recordings into interactive active-recall exercises.",
            "Instead of spending hours manually creating flashcards or summarizing notes, you can focus your time on high-yield problem solving and testing."
          ]
        },
        {
          "heading": "3. Actionable Framework for Success",
          "body": [
            "Start each study session with a 5-minute pre-test to activate relevant neural pathways.",
            "Engage in interleaved practice by mixing problem types rather than drilling single concepts in isolation.",
            "Review challenging topics 24 hours later, then 3 days later, to maximize long-term retention."
          ],
          "keyPoint": "Consistency in small daily increments yields dramatically superior results compared to last-minute cram sessions."
        }
      ],
      "conclusion": "Mastering modern academic workflows enables you to achieve top grades with less stress and greater clarity. Embrace active learning to unlock your full potential."
    }
  }
];

export default function BlogsPage() {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePost(null);
      }
    };

    if (activePost) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePost]);

  const handleShare = () => {
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
      <main className="flex-1 w-full bg-white">
        {/* Centered Heading */}
        <div className="pt-14 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 text-center">
          <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-medium tracking-[-1.5px] sm:tracking-[-2px] text-[#121212] select-none">
            Blogs
          </h1>
        </div>

        {/* Blog Post List matching YouLearn's exact layout */}
        <div className="w-full max-w-[850px] mx-auto px-6 flex flex-col gap-9 sm:gap-11 pb-24 sm:pb-32">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="flex items-center gap-5 sm:gap-10 group cursor-pointer w-full text-left"
            >
              {/* Left: Thumbnail Image */}
              <div className="relative w-24 h-24 sm:w-[150px] sm:h-[150px] shrink-0 rounded-[10px] overflow-hidden bg-neutral-100 shadow-xs">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Right: Title & Date */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h2 className="text-[20px] sm:text-[28px] lg:text-[32px] font-medium tracking-[-0.75px] sm:tracking-[-1.5px] leading-[1.3] text-[#121212] group-hover:opacity-75 transition-opacity">
                  {post.title}
                </h2>
                <p className="text-[14px] sm:text-[18px] text-[#999999] font-normal mt-2 sm:mt-2.5">
                  {post.date}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Closing CTA */}
        <ClosingCta />
      </main>

      {/* Full Article Reader Modal */}
      {activePost && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="bg-white w-full max-w-[820px] max-h-[92vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-20">
              <button
                onClick={() => setActivePost(null)}
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blogs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors relative cursor-pointer"
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
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  aria-label="Close"
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

                <h1 className="text-2xl sm:text-4xl font-semibold text-[#121212] tracking-tight leading-tight">
                  {activePost.title}
                </h1>
              </div>

              {/* Cover Image */}
              <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 bg-neutral-100">
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
                      <div className="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-neutral-800">
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
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-neutral-900 text-base">
                    Put this into practice with YouLearn
                  </h4>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Upload your class documents and let your personal AI tutor quiz you right now.
                  </p>
                </div>
                <Link
                  href="/signin"
                  className="shrink-0 px-5 py-2.5 bg-neutral-950 text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5"
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
