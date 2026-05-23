"use client";

import { Share2, X, Loader2, Search, Plus, Sparkles, Scale, GraduationCap, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useColleges } from "@/hooks/useColleges";
import { formatFeeRange } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const storeItems = useCompareStore((state) => state.items);
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);

  // Derive active compared IDs from URL parameter first, falling back to local Zustand store
  const urlIds = searchParams.get("ids");
  const ids = (urlIds !== null ? urlIds : storeItems.map((item) => item.id).join(","))
    .split(",")
    .filter(Boolean);

  // Synchronize URL IDs to Zustand store on mount if there's a difference
  useEffect(() => {
    if (urlIds) {
      const parsedIds = urlIds.split(",").filter(Boolean);
      parsedIds.forEach((id) => {
        if (!storeItems.some((item) => item.id === id)) {
          // Attempt to add. In case we don't have details, store minimal
          add({ id, slug: id, name: id.split("-").join(" "), city: "", state: "" });
        }
      });
    }
  }, [urlIds, add, storeItems]);

  const { data: collegesRes, isLoading } = useColleges({ ids: ids.join(",") });
  const selected = (collegesRes?.data || []).slice(0, 3);

  // Inline search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchRes, isLoading: isSearching } = useColleges({
    search: debouncedQuery,
    pageSize: 5
  });

  const searchResults = searchRes?.data || [];

  function handleAdd(college: any) {
    if (ids.includes(college.id)) {
      toast.info("College is already in compare");
      return;
    }
    if (ids.length >= 3) {
      toast.error("You can compare up to 3 colleges");
      return;
    }

    add({
      id: college.id,
      slug: college.slug,
      name: college.name,
      city: college.city,
      state: college.state
    });

    const nextIds = [...ids, college.id];
    const next = new URLSearchParams(searchParams.toString());
    next.set("ids", nextIds.join(","));
    router.replace(`/compare?${next.toString()}`);
    setSearchQuery("");
  }

  function handleRemove(id: string) {
    remove(id);
    const nextIds = ids.filter((currId) => currId !== id);
    const next = new URLSearchParams(searchParams.toString());
    if (nextIds.length > 0) {
      next.set("ids", nextIds.join(","));
    } else {
      next.delete("ids");
    }
    router.replace(`/compare?${next.toString()}`);
  }

  function share() {
    const url = `${window.location.origin}/compare?ids=${selected.map((college) => college.id).join(",")}`;
    void navigator.clipboard.writeText(url);
    toast.success("Shareable compare URL copied to clipboard");
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center justify-center sm:px-6 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 mt-4 font-semibold text-slate-500">Loading comparison details...</span>
      </main>
    );
  }

  // EMPTY STATE WITH DIRECT SEARCH
  if (selected.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-450">
            <Scale className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Compare Colleges</h1>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            Search and add up to three Indian universities to compare courses, placement packages, NIRF rankings, and fees side-by-side.
          </p>
        </div>

        {/* Large Centered Search Widget */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college name, city, or course type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-base outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus:border-blue-900 transition-all"
            />
          </div>

          {/* Search results */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-6 border-t border-slate-100 dark:border-slate-850 pt-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Search Results</h3>
              {isSearching ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No colleges found matching your search query.</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((college) => (
                    <div
                      key={college.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-blue-500 mt-1" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{college.name}</h4>
                          <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {college.city}, {college.state}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdd(college)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-3 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  const lowestFee = Math.min(...selected.map((college) => college.annualFeesMin));
  const highestRating = Math.max(...selected.map((college) => college.rating));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Colleges</h1>
          <p className="mt-2 text-slate-550 dark:text-slate-350">
            Comparing {selected.length} {selected.length === 1 ? "college" : "colleges"}. Differences are highlighted in amber.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.length < 3 && (
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Quick add college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 pl-8 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 focus:bg-white"
                />
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Quick Results Popover */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white p-3 shadow-xl dark:bg-slate-950 z-50">
                  {isSearching ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : searchResults.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2 text-center">No colleges found.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {searchResults.map((col) => {
                        const isAlreadyAdded = ids.includes(col.id);
                        return (
                          <div
                            key={col.id}
                            className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                          >
                            <div className="truncate pr-2">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{col.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{col.city}, {col.state}</p>
                            </div>
                            <button
                              disabled={isAlreadyAdded}
                              onClick={() => handleAdd(col)}
                              className="shrink-0 inline-flex h-7 items-center gap-1 rounded bg-blue-50 px-2 text-[10px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 dark:bg-blue-950/40 dark:text-blue-400"
                            >
                              <Plus className="h-3 w-3" />
                              {isAlreadyAdded ? "Added" : "Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={share}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary dark:bg-slate-950 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share URL
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-slate-950 shadow-sm">
        <table className="w-full min-w-[860px] table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-850">
              <th className="w-56 p-5 font-semibold text-slate-400 uppercase tracking-wider text-xs">Comparison Criteria</th>
              {selected.map((college) => (
                <th key={college.id} className="p-5 align-top">
                  <div className="flex items-start justify-between gap-3">
                    <div className="pr-2">
                      <Link href={`/colleges/${college.slug}`} className="text-base font-extrabold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 leading-snug">
                        {college.name}
                      </Link>
                      <p className="mt-1.5 text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {college.city}, {college.state}
                      </p>
                    </div>
                    <button
                      aria-label={`Remove ${college.name} from comparison`}
                      onClick={() => handleRemove(college.id)}
                      className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {college.annualFeesMin === lowestFee ? <Badge color="emerald">Best Value</Badge> : null}
                    {college.rating === highestRating ? <Badge color="amber">Top Rated</Badge> : null}
                  </div>
                </th>
              ))}

              {/* DASHED COLUMN INCASE SLOTS REMAIN */}
              {selected.length < 3 && (
                <th className="p-5 align-middle w-72 bg-slate-50/30 border-l border-dashed border-slate-200 dark:bg-slate-900/10 dark:border-slate-850">
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                    <span className="mt-2 text-xs font-bold text-slate-400">Slot Available ({3 - selected.length} left)</span>
                    <span className="mt-1 text-[11px] text-slate-350">Use the quick add search above!</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            <Row label="Location" values={selected.map((college) => `${college.city}, ${college.state}`)} emptyCount={3 - selected.length} />
            <Row label="Established" values={selected.map((college) => String(college.established))} emptyCount={3 - selected.length} />
            <Row label="NIRF Ranking" values={selected.map((college) => (college.nirfRanking ? `#${college.nirfRanking}` : "NA"))} emptyCount={3 - selected.length} />
            <Row label="Overall Rating" values={selected.map((college) => `${college.rating.toFixed(1)} / 5`)} emptyCount={3 - selected.length} />
            <Row label="Annual Fees" values={selected.map((college) => formatFeeRange(college.annualFeesMin, college.annualFeesMax))} emptyCount={3 - selected.length} />
            <Row label="Average Placement" values={selected.map((college) => `${college.avgPackageLPA || 0} LPA`)} emptyCount={3 - selected.length} />
            <Row label="Highest Placement" values={selected.map((college) => `${college.highestPackageLPA || 0} LPA`)} emptyCount={3 - selected.length} />
            <Row label="Placement Success" values={selected.map((college) => `${college.placementPercent || 0}%`)} emptyCount={3 - selected.length} />
            <Row label="Accreditations" values={selected.map((college) => college.accreditations.join(", "))} emptyCount={3 - selected.length} />
            <Row label="Campus Area" values={selected.map((college) => `${college.campusAreaAcres || 0} Acres`)} emptyCount={3 - selected.length} />
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "emerald" | "amber" }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30",
    amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30"
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[color]}`}>
      {children}
    </span>
  );
}

interface RowProps {
  label: string;
  values: string[];
  emptyCount: number;
}

function Row({ label, values, emptyCount }: RowProps) {
  // If the criteria values differ across selected colleges, highlight the row differences
  const differs = values.length > 1 && new Set(values).size > 1;

  return (
    <tr className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors">
      <th className="p-5 font-bold text-slate-655 dark:text-slate-350">{label}</th>
      {values.map((value, index) => (
        <td
          key={`${label}-${index}`}
          className={
            differs
              ? "bg-amber-50/40 p-5 font-medium text-slate-800 dark:bg-amber-950/15 dark:text-slate-200"
              : "p-5 text-slate-700 dark:text-slate-350"
          }
        >
          {value}
        </td>
      ))}
      {/* Blank space to match placeholder column */}
      {emptyCount > 0 && (
        <td className="p-5 bg-slate-50/10 border-l border-dashed border-slate-100 dark:bg-slate-900/5 dark:border-slate-850" />
      )}
    </tr>
  );
}
