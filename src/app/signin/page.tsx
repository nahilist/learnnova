"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LearnNovaLogo } from "@/components/Icons";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth/client";

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
  const { data: session, isPending } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/app");
    }
  }, [session, isPending, router]);

  const finishAuthentication = () => {
    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.replace(nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/app");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.trim().split("@")[0],
        });
        if (error) {
          setErrorMessage(error.message || "Failed to create account. Please try again.");
          setIsLoading(false);
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (error) {
          setErrorMessage(error.message || "Invalid email or password.");
          setIsLoading(false);
          return;
        }
      }
      finishAuthentication();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleOAuth = async (providerName: "google" | "github") => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const callbackURL = `${window.location.origin}/app`;
      await authClient.signIn.social({
        provider: providerName,
        callbackURL,
      });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const msg = errObj?.message || "";
      if (msg.includes("403")) {
        setErrorMessage("Access denied (HTTP 403). Please make sure you have created an account via 'Sign up' below, or that the current domain is authorized in Neon Auth.");
      } else {
        setErrorMessage(msg || `Failed to sign in with ${providerName}.`);
      }
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Enter your email address first, then request a password reset.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.forgetPassword.emailOtp({
        email: email.trim(),
      });
      if (error) {
        setErrorMessage(error.message || "Failed to send reset instructions.");
      } else {
        setSuccessMessage("Password reset instructions sent. Please check your inbox.");
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj?.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between text-neutral-900 selection:bg-neutral-200">
      {/* Top Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <LearnNovaLogo />
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
              ? "Start learning smarter with your personal AI tutor on Neon."
              : "Let's continue your learning journey."}
          </p>

          {errorMessage && (
            <div role="alert" className="mb-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs leading-5 text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div role="status" className="mb-5 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-xs leading-5 text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* Social Logins */}
          <div className="w-full space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-sm font-medium text-neutral-800 shadow-2xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuth("github")}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-sm font-medium text-neutral-800 shadow-2xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
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
            {isSignUp && (
              <div>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                autoComplete="email"
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
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
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
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-full bg-neutral-800 hover:bg-black text-white font-medium text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span>{isSignUp ? "Creating your account..." : "Signing you in..."}</span>
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
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="font-semibold text-neutral-900 hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

        </div>
      </div>

      {/* Footer info */}
      <footer className="w-full py-4 text-center text-xs text-neutral-400">
        © 2026 LearnNova Inc. All rights reserved. Powered by Neon.
      </footer>
    </div>
  );
}
