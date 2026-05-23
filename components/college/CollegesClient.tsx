"use client";

import { Filter, SlidersHorizontal } from "lucide-react";
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
      <div className="sticky top-[60px] z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <span className="select-none text-xs font-semibold text-slate-500">
          Showing {totalColleges} colleges
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-gold px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-goldLight"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="rounded-[6px] border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-brand-gold"
          >
            <option value="ranking">NIRF Ranking</option>
            <option value="rating">Rating</option>
            <option value="fees-asc">Fees Low-High</option>
            <option value="fees-desc">Fees High-Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 hidden select-none rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <p className="text-sm font-semibold text-brand-gold">College directory</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Discover colleges</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Search by stream, city, fees, ranking, and ratings to build a practical admission shortlist.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <CollegeFilters
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <section className="min-w-0 flex-1">
            <div className="mb-6 hidden items-center justify-between rounded-[8px] border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex">
              <span className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-950">{totalColleges}</span> colleges
              </span>
              <div className="flex items-center gap-2 text-xs font-medium">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Sort by</span>
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="rounded-[6px] border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-brand-gold"
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
              <div className="flex flex-col items-center rounded-[8px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mb-4 rounded-[8px] bg-brand-goldLight p-4 text-brand-navy">
                  <Filter className="h-9 w-9" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">No colleges match your filters</h2>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500">
                  Try removing a filter or searching with a broader course, city, or college name.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 rounded-[6px] bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-goldHover"
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
                <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                  <Link
                    href={createPageUrl(Math.max(1, page - 1))}
                    className={cn(
                      "rounded-[6px] border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white sm:text-sm",
                      page <= 1 && "pointer-events-none opacity-40"
                    )}
                  >
                    Previous
                  </Link>
                  <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Link
                    href={createPageUrl(Math.min(totalPages, page + 1))}
                    className={cn(
                      "rounded-[6px] border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white sm:text-sm",
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
