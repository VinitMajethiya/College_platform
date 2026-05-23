"use client";

import { Heart, Menu, Search, Scale, X, LogOut, Bookmark, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCompareStore } from "@/store/compareStore";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { data: session, status } = useSession();
  const compareCount = useCompareStore((state) => state.items.length);
  const openSearch = useSearchStore((state) => state.open);

  const links = [
    { label: "Colleges", href: "/colleges" },
    { label: "Compare", href: "/compare" },
    { label: "Saved", href: "/saved" },
    ...(status === "authenticated" ? [{ label: "My Profile", href: "/saved" }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 h-[60px] border-b border-white/5 bg-brand-navy/95 backdrop-blur">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-lg tracking-tight select-none hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="UniVerdict Logo"
            width={36}
            height={36}
            className="flex-shrink-0 drop-shadow-sm"
          />
          <span>
            Uni<span className="text-brand-gold">Verdict</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm transition-colors duration-150 py-1 border-b-2",
                  isActive
                    ? "text-brand-orange border-brand-orange font-medium"
                    : "text-slate-400 border-transparent hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            aria-label="Search colleges"
            className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Compare Indicator */}
          <Link
            aria-label="Compare colleges"
            href="/compare"
            className={cn(
              "relative rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-all",
              pathname === "/compare" && "text-brand-orange"
            )}
          >
            <Scale className="h-5 w-5" />
            {compareCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Profile / Authentication */}
          {status === "authenticated" && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((val) => !val)}
                className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-brand-orange transition-all focus:outline-none"
                aria-label="User menu"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border border-white/10"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </button>
              
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/5 bg-brand-navyMid p-1.5 shadow-xl z-40">
                    <div className="px-3 py-2 text-xs text-slate-400 border-b border-white/5 mb-1 select-none">
                      <p className="font-semibold text-white truncate">{session.user.name}</p>
                      <p className="text-[10px] truncate opacity-70">{session.user.email}</p>
                    </div>
                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Bookmark className="h-4 w-4 text-slate-400" />
                      Saved Colleges
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        void signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              className="rounded-full bg-brand-orange hover:bg-brand-orangeHover px-5 py-2 text-sm font-semibold text-white transition-all shadow-sm shadow-brand-orange/10"
              href="/auth/signin"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={openSearch}
            aria-label="Search colleges"
            className="rounded-full p-2 text-slate-400 hover:text-white"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            className="rounded-full p-2 text-slate-400 hover:text-white"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Slide in from Right) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-[280px] bg-brand-navy p-6 flex flex-col justify-between border-l border-white/5 animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <span className="flex items-center gap-2.5 font-semibold text-white">
                  <Image src="/images/logo.png" alt="UniVerdict Logo" width={28} height={28} className="flex-shrink-0" />
                  <span>
                    Uni<span className="text-brand-gold">Verdict</span>
                  </span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="flex flex-col gap-1 py-6">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-orange/10 text-brand-orange"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {link.label === "Saved" && <Heart className="h-4 w-4" />}
                      {link.label === "Compare" && <Scale className="h-4 w-4" />}
                      {link.label === "Colleges" && <User className="h-4 w-4" />}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Auth section */}
            <div className="border-t border-white/5 pt-6">
              {status === "authenticated" && session?.user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                    <div className="truncate flex-1">
                      <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void signOut();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex w-full items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orangeHover px-4 py-2.5 text-center text-sm font-semibold text-white transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
