"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { YouLearnLogo, AppleIcon } from "@/components/Icons";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/app");
    }, 700);
  };

  const handleOAuth = (provider?: string) => {
    setIsLoading(true);
    if (provider) {
      // Simulate OAuth provider handshake
      sessionStorage.setItem("auth_provider", provider);
    }
    setTimeout(() => {
      router.push("/app");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between text-neutral-900 selection:bg-neutral-200">
      {/* Top Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <YouLearnLogo />
          </Link>
        </div>

        <Link
          href="/"
          className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-black transition-colors"
        >
          Back to website
        </Link>
      </header>

      {/* Main Form Center Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-10 border border-neutral-200/90 shadow-xl flex flex-col items-center text-center">
          
          {/* Logo mark */}
          <div className="mb-4">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="6" height="20" rx="3" fill="#000000" />
              <rect x="13" y="10" width="6" height="14" rx="3" fill="#000000" />
              <circle cx="23" cy="7" r="3" fill="#000000" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-semibold text-neutral-900 tracking-tight mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>

          <p className="text-sm text-neutral-500 mb-8 font-normal">
            {isSignUp
              ? "Start learning smarter with your personal AI tutor."
              : "Let's continue your learning journey."}
          </p>

          {/* Social Logins */}
          <div className="w-full space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("Google")}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-sm font-medium text-neutral-800 shadow-2xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuth("Apple")}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-sm font-medium text-neutral-800 shadow-2xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <AppleIcon className="w-4 h-4 text-black" />
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-2 mb-6">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <span className="text-xs text-neutral-400 font-medium select-none">
              or continue with
            </span>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-11 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert("Password reset link has been sent to your email.")}
                  className="text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-full bg-neutral-800 hover:bg-black text-white font-medium text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Entering study workspace...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-6 text-xs text-neutral-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-neutral-900 hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

        </div>
      </div>

      {/* Footer info */}
      <footer className="w-full py-4 text-center text-xs text-neutral-400">
        © 2026 YouLearn Inc. All rights reserved.
      </footer>
    </div>
  );
}
