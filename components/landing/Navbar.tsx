"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = isSignedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Questions", href: "/dashboard/questions" },
        { label: "Reports", href: "/dashboard/reports" },
        { label: "Agentic System", href: "/agentic" },
      ]
    : [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Questions", href: "/#question" },
        { label: "Reports", href: "/dashboard/reports" },
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#howitworks" },
        { label: "Agentic System", href: "/agentic" },
      ];

  const getNavHref = (href: string) => {
    if (href === "/dashboard" || href.startsWith("/dashboard")) {
      return isSignedIn ? href : `/login?callbackUrl=${encodeURIComponent(href)}`;
    }
    return href;
  };

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/agentic") return pathname === "/agentic";
    if (href.startsWith("/dashboard/")) return pathname === href;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-[64px] min-h-[64px] flex items-center ${
        scrolled
          ? "bg-[#fafafa]/90 backdrop-blur-md border-b border-[#e6e6e6] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)]"
          : "bg-[#fafafa] border-b border-[#e6e6e6]"
      }`}
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-2.5 group py-1 select-none">
          <div className="w-7 h-7 rounded-[10px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-semibold text-sm select-none shadow-[0px_1px_2px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="font-sans font-semibold text-[16px] tracking-[-0.02em] text-[#141414]">
            Campus OS
          </span>
        </Link>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map(({ label, href }) => {
            const isActive = isLinkActive(href);
            return (
              <Link
                key={label}
                href={getNavHref(href)}
                className={`text-[14px] font-medium px-3.5 py-2 rounded-[10px] transition-colors leading-none flex items-center justify-center ${
                  isActive
                    ? "text-[#141414] bg-[#f0f0f0] font-semibold"
                    : "text-[#545454] hover:text-[#141414] hover:bg-[#f0f0f0]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Action Stack */}
        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 border border-[#d6d6d6] rounded-[10px] px-3 py-1.5 bg-[#fafafa] text-[#141414] text-sm font-medium hover:bg-[#f0f0f0] transition-colors cursor-pointer leading-none"
                aria-expanded={dropdownOpen}
              >
                <span className="w-5 h-5 rounded-full bg-[#009959] text-white text-[11px] font-medium flex items-center justify-center">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="max-w-[100px] truncate">{session?.user?.name || "Guest"}</span>
                <ChevronDown size={14} className="text-[#707070]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#fafafa] border border-[#e6e6e6] rounded-[10px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-[#e6e6e6]">
                    <p className="text-xs text-[#707070] truncate font-mono">
                      {session?.user?.email || "guest@example.com"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#141414] hover:bg-[#f0f0f0] transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-sm text-[#dc2626] hover:bg-[#dc2626]/5 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-[14px] font-medium text-[#545454] hover:text-[#141414] px-3.5 py-2 rounded-[10px] hover:bg-[#f0f0f0] transition-colors leading-none flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href={getNavHref("/dashboard")}
                className="btn-grain-primary text-[14px] py-2 px-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] leading-none flex items-center gap-1.5 justify-center"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-[#141414] p-2 rounded-[10px] hover:bg-[#f0f0f0] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#fafafa]/98 backdrop-blur-lg border-b border-[#e6e6e6] px-4 sm:px-6 py-4 flex flex-col gap-1.5 shadow-[0px_8px_16px_rgba(0,0,0,0.04)] animate-in slide-in-from-top-2 duration-150">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={getNavHref(href)}
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-medium text-[#141414] py-2.5 px-3 rounded-[10px] hover:bg-[#f0f0f0] transition-colors"
            >
              {label}
            </Link>
          ))}
          {!isSignedIn && (
            <div className="flex flex-col gap-2 pt-3 mt-1.5 border-t border-[#e6e6e6]">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-grain-secondary w-full text-center py-2.5 text-sm"
              >
                Log In
              </Link>
              <Link
                href={getNavHref("/dashboard")}
                onClick={() => setMobileOpen(false)}
                className="btn-grain-primary w-full text-center py-2.5 text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
