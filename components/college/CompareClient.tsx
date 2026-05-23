"use client";

import { Share2, X, Loader2, Search, Plus, Sparkles, Scale, GraduationCap, MapPin, Award, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useColleges } from "@/hooks/useColleges";
import { formatCurrencyINR } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";
import { getStreamGradient } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeItems = useCompareStore((state) => state.items);
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);

  // Derive compared IDs from URL first, then Estado Zustand store
  const urlIds = searchParams.get("ids");
  const ids = (urlIds !== null ? urlIds : storeItems.map((item) => item.id).join(","))
    .split(",")
    .filter(Boolean);

  // Sync Zustand store with URL IDs
  useEffect(() => {
    if (urlIds) {
      const parsedIds = urlIds.split(",").filter(Boolean);
      parsedIds.forEach((id) => {
        if (!storeItems.some((item) => item.id === id)) {
          add({ id, slug: id, name: id.split("-").join(" "), city: "", state: "" });
        }
      });
    }
  }, [urlIds, add, storeItems]);

  const { data: collegesRes, isLoading } = useColleges({ ids: ids.join(",") });
  const selected = (collegesRes?.data || []).slice(0, 3);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
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
      toast.error("Remove a college first to add another.");
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
    toast.success("Link copied!");
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 flex flex-col items-center justify-center sm:px-6 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-2 mt-4 font-semibold text-slate-500 text-sm">Loading comparison details...</span>
      </main>
    );
  }

  // 1. EMPTY STATE
  if (selected.length === 0) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center select-none">
        <div className="p-5 bg-brand-orange/10 rounded-full text-brand-orange w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Your compare tray is empty</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Browse colleges and tap + Compare to add them here.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/colleges"
            className="inline-flex items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orangeHover px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-orange/15 active:scale-95"
          >
            Browse colleges →
          </Link>
        </div>
      </main>
    );
  }

  // Highlight calculations
  const lowestMinFees = Math.min(...selected.map((c) => c.annualFeesMin));
  const highestRating = Math.max(...selected.map((c) => c.rating));
  const highestAvgPackage = Math.max(...selected.map((c) => c.avgPackageLPA || 0));
  const highestPlacementRate = Math.max(...selected.map((c) => c.placementPercent || 0));
  const bestNirf = Math.min(...selected.map((c) => c.nirfRanking || 999999).filter((r) => r !== 999999));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Compare Colleges</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            Comparing {selected.length} {selected.length === 1 ? "college" : "colleges"}. Use search slots to add more.
          </p>
        </div>
        
        <button
          onClick={share}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-orange text-brand-orange hover:bg-brand-orangeLight px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          <span>🔗 Share this comparison</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-48 p-4 font-semibold text-gray-400 uppercase tracking-wider text-[10px] select-none">
                Comparison Details
              </th>
              
              {selected.map((college) => {
                const courseTypes = college.courses.map((c) => c.type.toLowerCase());
                let stream = "default";
                if (courseTypes.includes("engineering")) stream = "engineering";
                else if (courseTypes.includes("medical")) stream = "medical";
                else if (courseTypes.includes("management")) stream = "management";
                else if (courseTypes.includes("law")) stream = "law";
                else if (courseTypes.includes("arts") || courseTypes.includes("arts & humanities")) stream = "arts";

                return (
                  <th key={college.id} className="p-4 align-top w-64 border-l border-gray-100">
                    <div className="space-y-3">
                      {/* Mini Banner */}
                      <div className="relative h-[60px] flex items-center px-4 overflow-hidden rounded-xl bg-brand-navy select-none">
                        <Image
                          src={college.imageUrl || `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`}
                          alt={college.name}
                          fill
                          className="object-cover opacity-35"
                          unoptimized
                        />
                        <span className="relative z-10 text-sm font-semibold text-white truncate pr-6">{college.name}</span>
                        <button
                          onClick={() => handleRemove(college.id)}
                          className="relative z-10 p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors ml-auto"
                          aria-label={`Remove ${college.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="text-xs font-semibold text-brand-orange hover:text-brand-orangeHover hover:underline"
                        >
                          View detail →
                        </Link>
                        <span className="text-[10px] text-gray-400">{college.city}, {college.state}</span>
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* DASHED COLUMN SLOT IF < 3 */}
              {[...Array(3 - selected.length)].map((_, i) => (
                <th key={`empty-${i}`} className="p-6 align-middle w-64 bg-gray-50/5 border-l border-dashed border-gray-200">
                  <div className="flex flex-col items-center justify-center text-center select-none">
                    <div className="p-2.5 bg-slate-100 text-slate-400 rounded-full mb-3">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-400">Add College</span>
                    <span className="text-[10px] text-gray-300 mt-1">Slot {selected.length + i + 1} available</span>
                    <button
                      onClick={() => {
                        const input = document.getElementById("compare-search-input");
                        input?.focus();
                        input?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-orange/30 text-brand-orange hover:bg-brand-orangeLight px-3.5 py-1.5 text-[10px] font-semibold transition-all active:scale-95 animate-pulse"
                    >
                      <span>Choose college</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {/* 1. Overview */}
            <tr className="bg-gray-50/40 select-none">
              <td colSpan={4} className="p-3 font-semibold text-gray-900 text-xs tracking-wider uppercase">
                Overview & Infrastructure
              </td>
            </tr>
            <CompareRow
              label="NIRF Ranking"
              values={selected.map((c) => (c.nirfRanking ? `#${c.nirfRanking}` : "N/A"))}
              emptyCount={3 - selected.length}
              highlightType="nirf"
              collegeFees={selected.map((c) => c.nirfRanking || 999999)}
              bestVal={bestNirf}
            />
            <CompareRow
              label="Overall Rating"
              values={selected.map((c) => `${c.rating.toFixed(1)} ★`)}
              emptyCount={3 - selected.length}
              highlightType="rating"
              collegeRatings={selected.map((c) => c.rating)}
              bestVal={highestRating}
            />
            <CompareRow
              label="Established"
              values={selected.map((c) => String(c.established))}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Accreditations"
              values={selected.map((c) => c.accreditations.join(", ") || "N/A")}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Campus Area"
              values={selected.map((c) => c.campusAreaAcres ? `${c.campusAreaAcres} Acres` : "N/A")}
              emptyCount={3 - selected.length}
            />

            {/* 2. Fees */}
            <tr className="bg-gray-50/40 select-none">
              <td colSpan={4} className="p-3 font-semibold text-gray-900 text-xs tracking-wider uppercase">
                Fees
              </td>
            </tr>
            <CompareRow
              label="Min Annual Fee"
              values={selected.map((c) => formatCurrencyINR(c.annualFeesMin))}
              emptyCount={3 - selected.length}
              highlightType="fees"
              collegeFees={selected.map((c) => c.annualFeesMin)}
              bestVal={lowestMinFees}
            />
            <CompareRow
              label="Max Annual Fee"
              values={selected.map((c) => formatCurrencyINR(c.annualFeesMax))}
              emptyCount={3 - selected.length}
            />

            {/* 3. Placements */}
            <tr className="bg-gray-50/40 select-none">
              <td colSpan={4} className="p-3 font-semibold text-gray-900 text-xs tracking-wider uppercase">
                Placements
              </td>
            </tr>
            <CompareRow
              label="Average Package"
              values={selected.map((c) => (c.avgPackageLPA ? `₹${c.avgPackageLPA} LPA` : "N/A"))}
              emptyCount={3 - selected.length}
              highlightType="placement"
              collegePackages={selected.map((c) => c.avgPackageLPA || 0)}
              bestVal={highestAvgPackage}
            />
            <CompareRow
              label="Highest Package"
              values={selected.map((c) => (c.highestPackageLPA ? `₹${c.highestPackageLPA} LPA` : "N/A"))}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Placement Rate"
              values={selected.map((c) => (c.placementPercent ? `${c.placementPercent}%` : "N/A"))}
              emptyCount={3 - selected.length}
              highlightType="placementRate"
              collegePackages={selected.map((c) => c.placementPercent || 0)}
              bestVal={highestPlacementRate}
            />
            <CompareRow
              label="Top Recruiters"
              values={selected.map((c) => c.topRecruiters?.join(", ") || "N/A")}
              emptyCount={3 - selected.length}
            />

            {/* 4. Courses */}
            <tr className="bg-gray-50/40 select-none">
              <td colSpan={4} className="p-3 font-semibold text-gray-900 text-xs tracking-wider uppercase">
                Courses & Academics
              </td>
            </tr>
            <tr className="hover:bg-gray-50/30">
              <td className="p-4 font-semibold text-gray-500">Available Streams</td>
              {selected.map((college) => {
                const uniqueStreams = Array.from(new Set(college.courses.map((c) => c.type)));
                return (
                  <td key={college.id} className="p-4 border-l border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {uniqueStreams.map((st) => (
                        <span key={st} className="bg-slate-100 text-slate-600 text-[9px] font-semibold px-2 py-0.5 rounded">
                          {st}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
              {selected.length < 3 && (
                <td className="p-4 border-l border-dashed border-gray-200 bg-gray-50/10" />
              )}
            </tr>
            <CompareRow
              label="Total Courses Offered"
              values={selected.map((c) => `${c.courses?.length || 0} Courses`)}
              emptyCount={3 - selected.length}
            />

            {/* 5. Contact & Location */}
            <tr className="bg-gray-50/40 select-none">
              <td colSpan={4} className="p-3 font-semibold text-gray-900 text-xs tracking-wider uppercase">
                Contact & Details
              </td>
            </tr>
            <CompareRow
              label="Location"
              values={selected.map((c) => `${c.city}, ${c.state}`)}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Website"
              values={selected.map((c) => c.website ? (
                <a
                  key={c.id}
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:text-brand-orangeHover hover:underline font-medium truncate block max-w-[180px]"
                >
                  {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              ) : "N/A")}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Email Address"
              values={selected.map((c) => c.email || "N/A")}
              emptyCount={3 - selected.length}
            />
            <CompareRow
              label="Phone Number"
              values={selected.map((c) => c.phone || "N/A")}
              emptyCount={3 - selected.length}
            />
          </tbody>
        </table>
      </div>

      {/* Highlights Legend */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-500 flex flex-wrap gap-6 items-center select-none">
        <span className="font-semibold text-gray-700">Colors Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-green-50 border border-green-200" />
          <span>Best Value (Lowest Fee)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-orange-50 border border-orange-200" />
          <span>Top Rated (Highest Stars)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-blue-50 border border-blue-200" />
          <span>Best Placement (Highest Avg Package)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-teal-50 border border-teal-200" />
          <span>Highest Placement Rate (%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-purple-50 border border-purple-200" />
          <span>Top Ranked (Best NIRF Rank)</span>
        </div>
      </div>

      {/* Quick Search Widget inside comparison panel (if slots remain) */}
      {selected.length < 3 && (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 select-none">
            Add a college to compare
          </h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="compare-search-input"
              type="text"
              placeholder="Search by college name, stream, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-slate-50/50 pl-11 pr-4 text-xs sm:text-sm outline-none focus:border-brand-orange focus:bg-white transition-all"
            />
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 select-none">Search Results</h4>
              {isSearching ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No colleges found matching &quot;{searchQuery}&quot;</p>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((col) => {
                    const isAlreadyAdded = ids.includes(col.id);
                    return (
                      <div
                        key={col.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-colors"
                      >
                        <div className="truncate">
                          <h5 className="text-xs font-bold text-gray-900 truncate">{col.name}</h5>
                          <p className="text-[10px] text-gray-400">{col.city}, {col.state}</p>
                        </div>
                        <button
                          disabled={isAlreadyAdded}
                          onClick={() => handleAdd(col)}
                          className={cn(
                            "inline-flex h-7 items-center gap-1 rounded px-2.5 text-[10px] font-semibold transition-all duration-100 active:scale-95 border",
                            isAlreadyAdded
                              ? "bg-slate-100 border-slate-200 text-slate-400"
                              : "bg-brand-orangeLight border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white"
                          )}
                        >
                          <Plus className="h-3 w-3" />
                          <span>{isAlreadyAdded ? "Added" : "Add"}</span>
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
    </main>
  );
}

interface CompareRowProps {
  label: string;
  values: (string | React.ReactNode)[];
  emptyCount: number;
  highlightType?: "fees" | "rating" | "placement" | "placementRate" | "nirf";
  collegeFees?: number[];
  collegeRatings?: number[];
  collegePackages?: number[];
  bestVal?: number;
}

function CompareRow({
  label,
  values,
  emptyCount,
  highlightType,
  collegeFees,
  collegeRatings,
  collegePackages,
  bestVal
}: CompareRowProps) {
  return (
    <tr className="hover:bg-gray-50/20 transition-colors">
      <td className="p-4 font-semibold text-gray-500 select-none">{label}</td>
      {values.map((value, idx) => {
        let isBest = false;
        let cellClass = "p-4 border-l border-gray-100 text-gray-700";

        if (highlightType === "fees" && collegeFees && bestVal !== undefined) {
          isBest = collegeFees[idx] === bestVal;
          if (isBest) cellClass = "p-4 border-l border-gray-100 bg-green-50 text-green-800 font-semibold border-y border-green-200";
        } else if (highlightType === "rating" && collegeRatings && bestVal !== undefined) {
          isBest = collegeRatings[idx] === bestVal;
          if (isBest) cellClass = "p-4 border-l border-gray-100 bg-orange-50 text-orange-850 font-semibold border-y border-orange-200";
        } else if (highlightType === "placement" && collegePackages && bestVal !== undefined && bestVal > 0) {
          isBest = collegePackages[idx] === bestVal;
          if (isBest) cellClass = "p-4 border-l border-gray-100 bg-blue-50 text-blue-800 font-semibold border-y border-blue-200";
        } else if (highlightType === "placementRate" && collegePackages && bestVal !== undefined && bestVal > 0) {
          isBest = collegePackages[idx] === bestVal;
          if (isBest) cellClass = "p-4 border-l border-gray-100 bg-teal-50 text-teal-800 font-semibold border-y border-teal-200";
        } else if (highlightType === "nirf" && collegeFees && bestVal !== undefined && bestVal < 999999) {
          isBest = collegeFees[idx] === bestVal;
          if (isBest) cellClass = "p-4 border-l border-gray-100 bg-purple-50 text-purple-800 font-semibold border-y border-purple-200";
        }

        return (
          <td key={idx} className={cellClass}>
            {value}
          </td>
        );
      })}
      {emptyCount > 0 && (
        <td className="p-4 border-l border-dashed border-gray-250 bg-gray-50/10" />
      )}
    </tr>
  );
}
