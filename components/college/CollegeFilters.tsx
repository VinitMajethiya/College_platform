"use client";

import { RotateCcw, Search as SearchIcon, Star, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { formatCurrencyINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statesList = [
  "Delhi",
  "Maharashtra",
  "Tamil Nadu",
  "Karnataka",
  "Uttar Pradesh",
  "Telangana",
  "Kerala",
  "Gujarat",
  "West Bengal",
  "Haryana"
];

const coursesList = [
  { label: "Engineering", value: "Engineering" },
  { label: "Medical", value: "Medical" },
  { label: "Management", value: "Management" },
  { label: "Law", value: "Law" },
  { label: "Arts & Humanities", value: "Arts" },
  { label: "Science", value: "Science" },
  { label: "Commerce", value: "Commerce" },
  { label: "Architecture", value: "Architecture" },
  { label: "Pharmacy", value: "Pharmacy" }
];

function toggleCsv(current: string | null, value: string) {
  const set = new Set((current ?? "").split(",").filter(Boolean));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set).join(",");
}

interface CollegeFiltersProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function CollegeFilters({
  mobileOpen = false,
  onMobileClose
}: CollegeFiltersProps) {
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [searchVal, setSearchVal] = useState(params.get("search") ?? "");
  const [showAllStreams, setShowAllStreams] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      startTransition(() => router.push(`/colleges?${next.toString()}`));
    },
    [params, router]
  );

  useEffect(() => {
    setSearchVal(params.get("search") ?? "");
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== (params.get("search") ?? "")) {
        updateFilter("search", searchVal);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal, params, updateFilter]);

  function clearAll() {
    setSearchVal("");
    startTransition(() => router.push("/colleges"));
    onMobileClose?.();
  }

  const activeStreamsCount = (params.get("course") ?? "")
    .split(",")
    .filter(Boolean).length;
  const activeLocationsCount = (params.get("state") ?? "")
    .split(",")
    .filter(Boolean).length;
  const currentMaxFees = Number(params.get("maxFees") ?? "2500000");
  const currentMinRating = Number(params.get("minRating") ?? "0");
  const currentMaxRank = params.get("maxRank");
  const currentSort = params.get("sort") ?? "ranking";

  const renderSectionLabel = (
    label: string,
    count?: number,
    htmlFor?: string
  ) => (
    <div className="mb-2 flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>
      {!!count && (
        <span className="rounded-full bg-brand-goldLight px-2 py-0.5 text-[10px] font-bold text-brand-navy">
          {count} selected
        </span>
      )}
    </div>
  );

  const renderFilterContent = () => (
    <div className="space-y-6 text-slate-800">
      <div>
        {renderSectionLabel("Search", undefined, "filter-search-input")}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="filter-search-input"
            type="text"
            className="w-full rounded-[6px] border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            placeholder="Search city, stream, name..."
            value={searchVal}
            onChange={(event) => setSearchVal(event.target.value)}
          />
        </div>
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("Stream", activeStreamsCount)}
        <div className="mt-1 max-h-[160px] space-y-2 overflow-y-auto pr-1">
          {coursesList
            .slice(0, showAllStreams ? coursesList.length : 5)
            .map((course) => {
              const isChecked = (params.get("course") ?? "")
                .split(",")
                .includes(course.value);
              return (
                <label
                  key={course.value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-950"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      updateFilter(
                        "course",
                        toggleCsv(params.get("course"), course.value)
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span>{course.label}</span>
                </label>
              );
            })}
        </div>
        <button
          onClick={() => setShowAllStreams(!showAllStreams)}
          className="mt-2 text-xs font-semibold text-brand-navy hover:text-brand-gold"
        >
          {showAllStreams ? "Show less" : "Show more"}
        </button>
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("Location", activeLocationsCount)}
        <div className="mt-1 max-h-[160px] space-y-2 overflow-y-auto pr-1">
          {statesList
            .slice(0, showAllLocations ? statesList.length : 5)
            .map((state) => {
              const isChecked = (params.get("state") ?? "")
                .split(",")
                .includes(state);
              return (
                <label
                  key={state}
                  className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-950"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      updateFilter(
                        "state",
                        toggleCsv(params.get("state"), state)
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span>{state}</span>
                </label>
              );
            })}
        </div>
        <button
          onClick={() => setShowAllLocations(!showAllLocations)}
          className="mt-2 text-xs font-semibold text-brand-navy hover:text-brand-gold"
        >
          {showAllLocations ? "Show less" : "Show more"}
        </button>
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("Max annual fees", undefined, "filter-fees-range")}
        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-900">
          <span>Rs 0</span>
          <span className="rounded bg-brand-goldLight px-2 py-0.5 text-brand-navy">
            Up to {formatCurrencyINR(currentMaxFees)}/yr
          </span>
        </div>
        <input
          id="filter-fees-range"
          type="range"
          min="50000"
          max="2500000"
          step="50000"
          value={currentMaxFees}
          onChange={(event) => updateFilter("maxFees", event.target.value)}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-gold"
        />
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("NIRF ranking")}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: "" },
            { label: "Top 10", value: "10" },
            { label: "Top 25", value: "25" },
            { label: "Top 50", value: "50" },
            { label: "Top 100", value: "100" }
          ].map((item) => {
            const isSelected =
              (currentMaxRank === null && item.value === "") ||
              currentMaxRank === item.value;
            return (
              <button
                key={item.label}
                onClick={() => updateFilter("maxRank", item.value)}
                className={cn(
                  "rounded-[6px] border px-3 py-1.5 text-xs font-medium transition",
                  isSelected
                    ? "border-brand-gold bg-brand-gold text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-gold hover:text-brand-navy"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("Minimum rating")}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = currentMinRating >= star;
            return (
              <button
                key={star}
                onClick={() =>
                  updateFilter(
                    "minRating",
                    currentMinRating === star ? "" : String(star)
                  )
                }
                className="transition-transform hover:scale-110 active:scale-95"
                aria-label={`${star} stars and above`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isSelected
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  )}
                />
              </button>
            );
          })}
          {currentMinRating > 0 && (
            <span className="ml-2 text-xs font-bold text-slate-500">
              ({currentMinRating}+)
            </span>
          )}
        </div>
      </div>

      <hr className="border-slate-100" />

      <div>
        {renderSectionLabel("Sort results by")}
        <div className="space-y-2">
          {[
            { label: "NIRF Rank", value: "ranking" },
            { label: "Overall Rating", value: "rating" },
            { label: "Fees: Low to High", value: "fees-asc" },
            { label: "Fees: High to Low", value: "fees-desc" },
            { label: "Name A-Z", value: "name" }
          ].map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              <input
                type="radio"
                name="sidebar-sort"
                value={item.value}
                checked={currentSort === item.value}
                onChange={() => updateFilter("sort", item.value)}
                className="h-4 w-4 border-slate-300 text-brand-gold focus:ring-brand-gold"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearAll}
        className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-brand-gold/35 py-2.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-goldLight"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      <aside className="sticky top-[76px] hidden h-fit w-[280px] rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm lg:block">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
        </div>
        {renderFilterContent()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-[16px] bg-white p-6 animate-in slide-in-from-bottom duration-300">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-950">Filters</h3>
              <button
                onClick={onMobileClose}
                className="rounded-full p-1 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            {renderFilterContent()}
          </div>
        </div>
      )}
    </>
  );
}
