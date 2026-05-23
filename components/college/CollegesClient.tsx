"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { CollegeFilters } from "@/components/college/CollegeFilters";
import { CollegeCard } from "@/components/college/CollegeCard";
import { College } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CollegesClientProps {
  colleges: College[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function CollegesClient({ colleges, pagination }: CollegesClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentSort = params.get("sort") ?? "ranking";
  const page = pagination.page;
  const totalPages = pagination.totalPages;
  const totalColleges = pagination.total;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(params.toString());
    next.set("sort", e.target.value);
    next.delete("page");
    router.push(`/colleges?${next.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/colleges");
  };

  // Build Pagination URLs
  const createPageUrl = (targetPage: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(targetPage));
    return `/colleges?${next.toString()}`;
  };

  return (
    <>
      {/* 1. Mobile Sticky Sub-Navbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-[60px] z-10 lg:hidden shadow-sm">
        <span className="text-xs font-semibold text-gray-500 select-none">
          Showing {totalColleges} colleges
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="border border-brand-orange text-brand-orange text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-brand-orangeLight transition-all active:scale-95"
          >
            Filters
          </button>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="border border-gray-200 rounded-xl text-xs px-2.5 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-brand-orange"
          >
            <option value="ranking">NIRF Ranking</option>
            <option value="rating">Rating</option>
            <option value="fees-asc">Fees Low-High</option>
            <option value="fees-desc">Fees High-Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* 2. Page Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Desktop Heading */}
        <div className="mb-8 hidden lg:block select-none">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Discover Colleges</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare premium universities, check fees, and explore placement packages.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          
          {/* Left panel (Filters) */}
          <CollegeFilters
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          {/* Right panel (Results) */}
          <section className="flex-1 min-w-0">
            {/* Desktop Sort Bar */}
            <div className="hidden lg:flex items-center justify-between border-b border-gray-100 pb-3 mb-6 select-none">
              <span className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{totalColleges}</span> colleges
              </span>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-gray-400">Sort by:</span>
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  <option value="ranking">NIRF Ranking</option>
                  <option value="rating">Overall Rating</option>
                  <option value="fees-asc">Fees: Low to High</option>
                  <option value="fees-desc">Fees: High to Low</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {colleges.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center select-none">
                <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange mb-4">
                  <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">No colleges match your filters</h2>
                <p className="mt-1.5 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Try removing some active checkboxes or broadening your search queries.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 bg-brand-orange hover:bg-brand-orangeHover text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-orange/15 active:scale-95"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between select-none">
                  <Link
                    href={createPageUrl(Math.max(1, page - 1))}
                    className={cn(
                      "rounded-xl border border-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-gray-50 text-gray-700 transition-all active:scale-95",
                      page <= 1 && "pointer-events-none opacity-40"
                    )}
                  >
                    Previous
                  </Link>
                  <span className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Page {page} of {totalPages}
                  </span>
                  <Link
                    href={createPageUrl(Math.min(totalPages, page + 1))}
                    className={cn(
                      "rounded-xl border border-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-gray-50 text-gray-700 transition-all active:scale-95",
                      page >= totalPages && "pointer-events-none opacity-40"
                    )}
                  >
                    Next
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
