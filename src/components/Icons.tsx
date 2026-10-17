import React from "react";

export function LearnNovaLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-xl text-neutral-900 select-none ${className}`}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect x="3" y="4" width="6" height="20" rx="3" fill="#000000" />
        <rect x="13" y="10" width="6" height="14" rx="3" fill="#000000" />
        <circle cx="23" cy="7" r="3" fill="#000000" />
      </svg>
      <span className="font-semibold text-[20px] text-black tracking-[-0.02em]">LearnNova</span>
    </div>
  );
}

export function YCBadgeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div className={`bg-[#ff6600] rounded-[3px] flex items-center justify-center font-bold text-white text-[10px] leading-none shrink-0 ${className}`}>
      Y
    </div>
  );
}

export function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.43-5.64-8.6-10.23-18.7-13.77-30.3-3.54-11.6-5.31-22.75-5.31-33.45 0-14.83 3.65-27.18 10.95-37.05 7.3-9.87 16.59-14.94 27.87-15.2 4.89 0 10.45 1.25 16.69 3.75 6.24 2.5 10.15 3.75 11.73 3.75 1.22 0 5.41-1.3 12.58-3.9 7.16-2.6 13.06-3.75 17.7-3.46 13.67.75 24.28 5.76 31.84 15.03-12.02 7.28-17.9 17.29-17.65 30.03.26 10.11 4.1 18.57 11.53 25.37 7.43 6.8 16.29 10.66 26.57 11.59-2.22 6.6-4.89 13.04-8.01 19.33zM119.22 31.55c0-7.39 2.67-14.54 8.01-21.46 5.34-6.92 12.06-11.23 20.16-12.94.38 1.45.58 2.75.58 3.9 0 7.39-2.73 14.74-8.2 22.04-5.46 7.3-12.29 11.75-20.48 13.36-.07-1.63-.07-3.26-.07-4.9z"/>
    </svg>
  );
}

export function GooglePlayIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <path fill="#4285F4" d="M37.5 24.5C34.7 28.2 33 33.7 33 40.5v431c0 6.8 1.7 12.3 4.5 16l234.3-234.3L37.5 24.5z"/>
      <path fill="#FBBC04" d="M352.3 191.7l-80.5 80.5 80.5 80.5 91.5-52.8c12.2-7 19.2-18.7 19.2-31.5 0-12.8-7-24.5-19.2-31.5l-91.5-45.2z"/>
      <path fill="#34A853" d="M37.5 487.5c6.2 3.5 13.8 4 21.2-.2l293.6-169.5-80.5-80.5L37.5 487.5z"/>
      <path fill="#EA4335" d="M37.5 24.5l234.3 234.3 80.5-80.5L58.7 8.8C51.3 4.5 43.7 5 37.5 24.5z"/>
    </svg>
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

export function UChicagoSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 54 64" className="h-full w-auto" fill="none">
        <path d="M5 6 L49 6 L49 34 C49 50 27 60 27 60 C27 60 5 50 5 34 Z" fill="#800000" stroke="#4A0000" strokeWidth="2" />
        <circle cx="27" cy="22" r="10" fill="#FAF5F5" />
        {/* Phoenix rising */}
        <path d="M27 16 C25 20 23 22 20 22 C24 24 26 27 27 30 C28 27 30 24 34 22 C31 22 29 20 27 16 Z" fill="#800000" />
        <text x="27" y="52" fontSize="4.2" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">CHICAGO</text>
      </svg>
    </div>
  );
}

export function MichiganSeal({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 56 56" className="h-full w-auto" fill="none">
        <circle cx="28" cy="28" r="26" fill="#18453B" stroke="#10332B" strokeWidth="2" />
        <path d="M28 12 C24 16 20 22 20 30 C20 38 24 43 28 44 C32 43 36 38 36 30 C36 22 32 16 28 12 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M23 24 H33 V32 H23 Z" fill="#18453B" />
        <text x="28" y="51" fontSize="4" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">MICHIGAN</text>
      </svg>
    </div>
  );
}
