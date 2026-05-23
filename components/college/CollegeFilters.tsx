"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useCallback } from "react";
import { X, Search as SearchIcon, Star, RotateCcw, Award } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrencyINR } from "@/lib/utils";

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

export function CollegeFilters({ mobileOpen = false, onMobileClose }: CollegeFiltersProps) {
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Local state for debounced search input
  const [searchVal, setSearchVal] = useState(params.get("search") ?? "");

  const updateFilter = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => router.push(`/colleges?${next.toString()}`));
  }, [params, router]);

  // Sync local search input with URL params when page changes externally
  useEffect(() => {
    setSearchVal(params.get("search") ?? "");
  }, [params]);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== (params.get("search") ?? "")) {
        updateFilter("search", searchVal);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal, params, updateFilter]);

  const [showAllStreams, setShowAllStreams] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  function clearAll() {
    setSearchVal("");
    startTransition(() => router.push("/colleges"));
    if (onMobileClose) onMobileClose();
  }

  // Active selections counters
  const activeStreamsCount = (params.get("course") ?? "").split(",").filter(Boolean).length;
  const activeLocationsCount = (params.get("state") ?? "").split(",").filter(Boolean).length;

  const currentMaxFees = Number(params.get("maxFees") ?? "2500000");
  const currentMinRating = Number(params.get("minRating") ?? "0");
  const currentMaxRank = params.get("maxRank");
  const currentSort = params.get("sort") ?? "ranking";

  const renderFilterContent = () => (
    <div className="space-y-6 text-gray-800">
      
      {/* 1. Search Bar */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
          Search
        </label>
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white placeholder-gray-400"
            placeholder="Search city, stream, name..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Stream / Course Type */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block select-none">
            Stream
          </label>
          {activeStreamsCount > 0 && (
            <span className="text-[10px] bg-brand-orangeLight text-brand-orange px-2 py-0.5 rounded-full font-bold">
              {activeStreamsCount} Selected
            </span>
          )}
        </div>
        <div className="space-y-2 mt-1 max-h-[160px] overflow-y-auto pr-1">
          {coursesList.slice(0, showAllStreams ? coursesList.length : 5).map((course) => {
            const isChecked = (params.get("course") ?? "").split(",").includes(course.value);
            return (
              <label key={course.value} className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateFilter("course", toggleCsv(params.get("course"), course.value))}
                  className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange h-4 w-4"
                />
                <span>{course.label}</span>
              </label>
            );
          })}
        </div>
        {coursesList.length > 5 && (
          <button
            onClick={() => setShowAllStreams(!showAllStreams)}
            className="mt-2 text-xs font-semibold text-brand-orange hover:text-brand-orangeHover"
          >
            {showAllStreams ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* 3. Location (State) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block select-none">
            Location
          </label>
          {activeLocationsCount > 0 && (
            <span className="text-[10px] bg-brand-orangeLight text-brand-orange px-2 py-0.5 rounded-full font-bold">
              {activeLocationsCount} Selected
            </span>
          )}
        </div>
        <div className="space-y-2 mt-1 max-h-[160px] overflow-y-auto pr-1">
          {statesList.slice(0, showAllLocations ? statesList.length : 5).map((state) => {
            const isChecked = (params.get("state") ?? "").split(",").includes(state);
            return (
              <label key={state} className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateFilter("state", toggleCsv(params.get("state"), state))}
                  className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange h-4 w-4"
                />
                <span>{state}</span>
              </label>
            );
          })}
        </div>
        {statesList.length > 5 && (
          <button
            onClick={() => setShowAllLocations(!showAllLocations)}
            className="mt-2 text-xs font-semibold text-brand-orange hover:text-brand-orangeHover"
          >
            {showAllLocations ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* 4. Annual Fees Slider */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
          Max Annual Fees
        </label>
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-1">
          <span>₹0</span>
          <span className="text-brand-orange bg-brand-orangeLight px-2 py-0.5 rounded-md">
            Up to {formatCurrencyINR(currentMaxFees)}/yr
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="2500000"
          step="50000"
          value={currentMaxFees}
          onChange={(e) => updateFilter("maxFees", e.target.value)}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mt-2"
        />
      </div>

      <hr className="border-gray-100" />

      {/* 5. NIRF Ranking */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3 select-none">
          NIRF Ranking
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: "" },
            { label: "Top 10", value: "10" },
            { label: "Top 25", value: "25" },
            { label: "Top 50", value: "50" },
            { label: "Top 100", value: "100" }
          ].map((item) => {
            const isSelected = (currentMaxRank === null && item.value === "") || currentMaxRank === item.value;
            return (
              <button
                key={item.label}
                onClick={() => updateFilter("maxRank", item.value)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150",
                  isSelected
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-orange/45 hover:text-brand-orange"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 6. Minimum Rating Stars */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 select-none">
          Minimum Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = currentMinRating >= star;
            return (
              <button
                key={star}
                onClick={() => updateFilter("minRating", currentMinRating === star ? "" : String(star))}
                className="focus:outline-none hover:scale-110 active:scale-90 transition-transform duration-100"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors duration-150",
                    isSelected ? "fill-amber-400 text-amber-400" : "text-gray-200"
                  )}
                />
              </button>
            );
          })}
          {currentMinRating > 0 && (
            <span className="text-xs font-bold text-gray-500 ml-2">({currentMinRating}+ Stars)</span>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 7. Sort By Radios */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3 select-none">
          Sort Results By
        </label>
        <div className="space-y-2">
          {[
            { label: "NIRF Rank", value: "ranking" },
            { label: "Overall Rating", value: "rating" },
            { label: "Fees: Low to High", value: "fees-asc" },
            { label: "Fees: High to Low", value: "fees-desc" },
            { label: "Name (A–Z)", value: "name" }
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="radio"
                name="sidebar-sort"
                value={item.value}
                checked={currentSort === item.value}
                onChange={() => updateFilter("sort", item.value)}
                className="text-brand-orange focus:ring-brand-orange border-gray-300 h-4 w-4"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Actions */}
      <button
        onClick={clearAll}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orangeHover transition-colors border border-brand-orange/20 rounded-xl py-2.5 hover:bg-brand-orangeLight"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );

  return (
    <>
      {/* A. Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] bg-white border border-gray-100 rounded-2xl p-5 sticky top-[76px] shadow-sm h-fit">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 select-none">
          <h2 className="font-semibold text-gray-900 text-lg">Filters</h2>
        </div>
        {renderFilterContent()}
      </aside>

      {/* B. Mobile Drawer Bottom Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl p-6 flex flex-col z-10 overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 select-none">
              <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
              <button
                onClick={onMobileClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {renderFilterContent()}
          </div>
        </div>
      )}
    </>
  );
}
