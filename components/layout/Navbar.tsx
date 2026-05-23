"use client";

import { Heart, Menu, Search, Scale } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { useCompareStore } from "@/store/compareStore";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const count = useCompareStore((state) => state.items.length);

  const links = [
    ["Colleges", "/colleges"],
    ["Compare", "/compare"],
    ["Saved", "/saved"]
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-slate-950/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">CC</span>
          CollegeCompass
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300">
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link aria-label="Search colleges" href="/colleges" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Search className="h-5 w-5" />
          </Link>
          <Link aria-label="Saved colleges" href="/saved" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Heart className="h-5 w-5" />
          </Link>
          <Link className="relative rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Compare colleges" href="/compare">
            <Scale className="h-5 w-5" />
            {count > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-xs font-bold text-emerald-950">{count}</span> : null}
          </Link>

          {status === "authenticated" && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((val) => !val)}
                className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="User menu"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover border"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </span>
                )}
              </button>
              {dropdownOpen ? (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg dark:bg-slate-950 z-40">
                    <div className="border-b px-4 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium truncate">
                      {session.user.name || session.user.email}
                    </div>
                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Saved Colleges
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        void signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" href="/auth/signin">
              Sign in
            </Link>
          )}
        </div>
        <button className="rounded-md p-2 md:hidden" aria-label="Open navigation" onClick={() => setOpen((value) => !value)}>
          <Menu className="h-6 w-6" />
        </button>
      </nav>
      {open ? (
        <div className="border-t bg-white px-4 py-3 dark:bg-slate-950 md:hidden space-y-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-md px-3 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-900" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          {status === "authenticated" && session?.user ? (
            <div className="border-t pt-2 mt-2 space-y-1">
              <div className="px-3 py-1 text-sm font-semibold text-slate-750 dark:text-slate-200">
                {session.user.name || session.user.email}
              </div>
              <Link
                href="/saved"
                className="block rounded-md px-3 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={() => setOpen(false)}
              >
                Saved Colleges
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="block w-full text-left rounded-md px-3 py-2 font-medium text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="block rounded-md bg-primary px-3 py-2 text-center font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      ) : null}
    </header>
  );
}
