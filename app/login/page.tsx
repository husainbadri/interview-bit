"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { useState, Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(error);
      setLoadingProvider(null);
    }
  };

  const handleGuestSignIn = async () => {
    setLoadingProvider("guest");
    try {
      await signIn("credentials", {
        email: "guest@example.com",
        callbackUrl,
      });
    } catch (error) {
      console.error(error);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md card-grain p-8 sm:p-10 bg-[#fafafa]">
        <div className="text-center mb-8">
          <div className="w-9 h-9 rounded-[10px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-semibold text-sm select-none mx-auto mb-4">
            C
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight mb-2 font-sans">
            Access Campus OS
          </h2>
          <p className="text-[#545454] text-sm font-sans">
            Sign in to calibrate your mock interview workspace and STAR feedback reports.
          </p>
        </div>

        <div className="space-y-3">
          {/* Guest Login — Primary Action in Forest Ink #009959 */}
          <button
            onClick={handleGuestSignIn}
            disabled={loadingProvider !== null}
            className="w-full btn-grain-primary py-3.5 px-5 justify-between disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-semibold text-[15px]">Continue as Guest</span>
              <span className="text-[12px] text-white/80 font-normal">Instant access with 3 free drills</span>
            </div>
            {loadingProvider === "guest" ? (
              <Loader2 className="animate-spin text-white" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-[#e6e6e6]" />
            <span className="flex-shrink mx-3 text-[#707070] text-xs uppercase tracking-wider font-mono">
              or sign in with
            </span>
            <div className="flex-grow border-t border-[#e6e6e6]" />
          </div>

          {/* Google Button */}
          <button
            onClick={() => handleSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full btn-grain-secondary py-3 justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-[14px]"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="animate-spin text-[#141414]" size={18} />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* GitHub Button */}
          <button
            onClick={() => handleSignIn("github")}
            disabled={loadingProvider !== null}
            className="w-full btn-grain-secondary py-3 justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-[14px]"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="animate-spin text-[#141414]" size={18} />
            ) : (
              <svg className="w-4 h-4 shrink-0 fill-[#141414]" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            <span className="font-medium">Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#e6e6e6] text-center text-xs text-[#707070]">
          <p>
            By continuing, you agree to our Terms of Calibration and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 border-b border-[#e6e6e6] bg-[#fafafa] px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[10px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-semibold text-sm select-none">
            C
          </div>
          <span className="font-sans font-semibold text-[16px] tracking-[-0.02em] text-[#141414]">
            Campus OS
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono text-[#707070] hover:text-[#141414] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] hover:bg-[#f0f0f0]"
        >
          <span>←</span>
          <span>Return to home</span>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#009959]" size={32} />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
