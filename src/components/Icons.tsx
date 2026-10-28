import React from "react";

export function YouLearnLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-xl text-neutral-900 select-none ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-black"
        aria-hidden="true"
      >
        <path d="M5.2 4.5C6.3 4.5 7.2 5.4 7.2 6.5V11.8C7.2 14.5 9.4 16.7 12.1 16.7C13.2 16.7 14.1 17.6 14.1 18.7C14.1 19.8 13.2 20.7 12.1 20.7C7.2 20.7 3.2 16.7 3.2 11.8V6.5C3.2 5.4 4.1 4.5 5.2 4.5Z" />
        <path d="M18.8 3.3C19.9 3.3 20.8 4.2 20.8 5.3V12.7C20.8 13.8 19.9 14.7 18.8 14.7C17.7 14.7 16.8 13.8 16.8 12.7V5.3C16.8 4.2 17.7 3.3 18.8 3.3Z" />
      </svg>
      <span className="font-bold text-[19px] text-neutral-900 tracking-[-0.03em]">YouLearn</span>
    </div>
  );
}

export function LearnNovaLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-xl text-neutral-900 select-none ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M6.5 21V8L19.5 21V7"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 16.2C5.8 9.1 14.7 4.2 22.8 7.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="23" cy="7" r="2.8" fill="currentColor" />
      </svg>
      <span className="font-semibold text-[20px] text-black tracking-[-0.02em]">LearnNova</span>
    </div>
  );
}

/* University Seal SVGs */
export function HarvardSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 60 70" className="h-full w-auto" fill="none">
        <path d="M5 10 C5 10 30 2 30 2 C30 2 55 10 55 10 C55 35 48 55 30 68 C12 55 5 35 5 10 Z" fill="#A51C30" stroke="#7A0019" strokeWidth="2" />
        <rect x="15" y="14" width="12" height="10" rx="1" fill="#FFFFFF" stroke="#000" strokeWidth="0.8"/>
        <text x="21" y="21" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#000">VE</text>
        <rect x="33" y="14" width="12" height="10" rx="1" fill="#FFFFFF" stroke="#000" strokeWidth="0.8"/>
        <text x="39" y="21" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#000">RI</text>
        <rect x="24" y="30" width="12" height="10" rx="1" fill="#FFFFFF" stroke="#000" strokeWidth="0.8"/>
        <text x="30" y="37" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#000">TAS</text>
        <text x="30" y="58" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#FFF" letterSpacing="0.08em">HARVARD</text>
      </svg>
    </div>
  );
}

export function StanfordSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 60 60" className="h-full w-auto" fill="none">
        <circle cx="30" cy="30" r="28" stroke="#8C1515" strokeWidth="2.5" fill="#FAF5F5" />
        <circle cx="30" cy="30" r="23" stroke="#8C1515" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        {/* Stanford Redwood Tree */}
        <path d="M30 12 L35 22 L33 22 L38 32 L34 32 L40 44 L20 44 L26 32 L22 32 L27 22 L25 22 Z" fill="#8C1515" />
        <rect x="28.5" y="44" width="3" height="5" fill="#8C1515" />
        <text x="30" y="54" fontSize="4.2" fontWeight="bold" textAnchor="middle" fill="#8C1515">STANFORD</text>
      </svg>
    </div>
  );
}

export function PrincetonSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 54 64" className="h-full w-auto" fill="none">
        <path d="M4 6 C4 6 27 2 27 2 C27 2 50 6 50 6 C50 32 44 50 27 60 C10 50 4 32 4 6 Z" fill="#111111" stroke="#E77500" strokeWidth="2" />
        <path d="M4 32 C15 32 27 38 27 60 C27 38 39 32 50 32" fill="#E77500" opacity="0.9" />
        <rect x="18" y="16" width="18" height="12" rx="1.5" fill="#FFFFFF" />
        <path d="M22 20 H32 M22 23 H32 M22 26 H29" stroke="#E77500" strokeWidth="1.2" strokeLinecap="round" />
        <text x="27" y="52" fontSize="4.5" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">PRINCETON</text>
      </svg>
    </div>
  );
}

export function UCLASeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 60 60" className="h-full w-auto" fill="none">
        <circle cx="30" cy="30" r="28" stroke="#2D68C4" strokeWidth="2" fill="#F0F7FF" />
        <circle cx="30" cy="30" r="23" stroke="#2D68C4" strokeWidth="1" fill="none" />
        <path d="M20 28 Q30 22 40 28 L40 38 Q30 32 20 38 Z" fill="#FFD100" stroke="#2D68C4" strokeWidth="1" />
        <text x="30" y="24" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#2D68C4">LET THERE BE LIGHT</text>
        <text x="30" y="47" fontSize="5.5" fontWeight="900" textAnchor="middle" fill="#2D68C4" letterSpacing="0.08em">UCLA</text>
      </svg>
    </div>
  );
}

export function UPennSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 54 64" className="h-full w-auto" fill="none">
        <path d="M5 6 L49 6 L49 34 C49 50 27 60 27 60 C27 60 5 50 5 34 Z" fill="#011F5B" stroke="#990000" strokeWidth="2" />
        <path d="M5 24 L49 24 L49 34 C49 50 27 60 27 60 C27 60 5 50 5 34 Z" fill="#990000" />
        <path d="M16 12 H38 V18 H16 Z" fill="#FFFFFF" />
        <path d="M22 36 L27 44 L32 36 Z" fill="#FFFFFF" />
        <text x="27" y="53" fontSize="4.8" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">PENN</text>
      </svg>
    </div>
  );
}

export function MichiganBlockM({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 64 52" className="h-full w-auto" fill="none">
        <path
          d="M6 48 L6 4 L22 4 L32 24 L42 4 L58 4 L58 48 L44 48 L44 22 L36 38 L28 38 L20 22 L20 48 Z"
          fill="#FFCB05"
          stroke="#00274C"
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  );
}

export function CornellSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 56 64" className="h-full w-auto" fill="none">
        <path d="M5 6 C5 6 28 2 28 2 C28 2 51 6 51 6 C51 32 46 52 28 62 C10 52 5 32 5 6 Z" fill="#B31B1B" stroke="#7A0000" strokeWidth="2" />
        <circle cx="28" cy="24" r="12" fill="#FFFFFF" opacity="0.95" />
        <rect x="22" y="19" width="12" height="10" rx="1" fill="#B31B1B" />
        <line x1="28" y1="19" x2="28" y2="29" stroke="#FFFFFF" strokeWidth="1" />
        <text x="28" y="52" fontSize="4.6" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" letterSpacing="0.06em">CORNELL</text>
      </svg>
    </div>
  );
}

export function MITSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 74 36" className="h-full w-auto" fill="none">
        {/* M */}
        <rect x="2" y="4" width="8" height="28" fill="#A31F34" />
        <rect x="14" y="4" width="8" height="20" fill="#A31F34" />
        <rect x="26" y="4" width="8" height="28" fill="#A31F34" />
        {/* I */}
        <rect x="38" y="4" width="8" height="28" fill="#A31F34" />
        {/* T */}
        <rect x="50" y="4" width="22" height="8" fill="#A31F34" />
        <rect x="57" y="12" width="8" height="20" fill="#A31F34" />
      </svg>
    </div>
  );
}

export function MichiganStateSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 54 54" className="h-full w-auto" fill="none">
        <circle cx="27" cy="27" r="25" fill="#18453B" />
        {/* Spartan Helmet silhouette */}
        <path
          d="M27 9 C20 9 15 14 15 21 C15 25 17 29 20 32 L20 41 L27 45 L34 41 L34 32 C37 29 39 25 39 21 C39 14 34 9 27 9 Z"
          fill="#FFFFFF"
        />
        <path d="M27 9 V45" stroke="#18453B" strokeWidth="2" />
        <path d="M22 23 H32 V27 H22 Z" fill="#18453B" />
      </svg>
    </div>
  );
}

