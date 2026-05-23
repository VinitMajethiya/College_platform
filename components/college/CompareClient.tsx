"use client";

import { Loader2, Plus, Search, Share2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useColleges } from "@/hooks/useColleges";
import { formatCurrencyINR } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/lib/utils";

const metricGroups = [
  {
    title: "Overview",
    rows: [
      {
        label: "NIRF Ranking",
        value: (college: any) =>
          college.nirfRanking ? `#${college.nirfRanking}` : "N/A"
      },
      {
        label: "Overall Rating",
        value: (college: any) => `${college.rating.toFixed(1)} stars`
      },
      {
        label: "Established",
        value: (college: any) => String(college.established)
      },
      {
        label: "Campus Area",
        value: (college: any) =>
          college.campusAreaAcres ? `${college.campusAreaAcres} acres` : "N/A"
      }
    ]
  },
  {
    title: "Fees and Placements",
    rows: [
      {
        label: "Min Annual Fee",
        value: (college: any) => formatCurrencyINR(college.annualFeesMin),
        lowerIsBetter: true
      },
      {
        label: "Max Annual Fee",
        value: (college: any) => formatCurrencyINR(college.annualFeesMax)
      },
      {
        label: "Average Package",
        value: (college: any) =>
          college.avgPackageLPA ? `Rs ${college.avgPackageLPA} LPA` : "N/A",
        higherIsBetter: true
      },
      {
        label: "Highest Package",
        value: (college: any) =>
          college.highestPackageLPA
            ? `Rs ${college.highestPackageLPA} LPA`
            : "N/A"
      },
      {
        label: "Placement Rate",
        value: (college: any) =>
          college.placementPercent ? `${college.placementPercent}%` : "N/A",
        higherIsBetter: true
      }
    ]
  },
  {
    title: "Academics and Contact",
    rows: [
      {
        label: "Streams",
        value: (college: any) =>
          Array.from(
            new Set(college.courses.map((course: any) => course.type))
          ).join(", ")
      },
      {
        label: "Courses Offered",
        value: (college: any) => `${college.courses.length} courses`
      },
      {
        label: "Location",
        value: (college: any) => `${college.city}, ${college.state}`
      },
      { label: "Email", value: (college: any) => college.email || "N/A" },
      { label: "Phone", value: (college: any) => college.phone || "N/A" }
    ]
  }
];

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeItems = useCompareStore((state) => state.items);
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);

  const urlIds = searchParams.get("ids");
  const ids = (
    urlIds !== null ? urlIds : storeItems.map((item) => item.id).join(",")
  )
    .split(",")
    .filter(Boolean);

  useEffect(() => {
    if (!urlIds) return;
    urlIds
      .split(",")
      .filter(Boolean)
      .forEach((id) => {
        if (!storeItems.some((item) => item.id === id)) {
          add({
            id,
            slug: id,
            name: id.split("-").join(" "),
            city: "",
            state: ""
          });
        }
      });
  }, [urlIds, add, storeItems]);

  const { data: collegesRes, isLoading } = useColleges(
    ids.length > 0 ? { ids: ids.join(",") } : { ids: "null" }
  );
  const selected = ids.length > 0 ? (collegesRes?.data || []).slice(0, 3) : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchRes, isLoading: isSearching } = useColleges({
    search: debouncedQuery,
    pageSize: 5
  });
  const searchResults = searchRes?.data || [];

  function syncIds(nextIds: string[]) {
    const next = new URLSearchParams(searchParams.toString());
    if (nextIds.length > 0) next.set("ids", nextIds.join(","));
    else next.delete("ids");
    router.replace(
      nextIds.length > 0 ? `/compare?${next.toString()}` : "/compare"
    );
  }

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
    syncIds([...ids, college.id]);
    setSearchQuery("");
  }

  function handleRemove(id: string) {
    remove(id);
    syncIds(ids.filter((currId) => currId !== id));
  }

  function share() {
    const url = `${window.location.origin}/compare?ids=${selected.map((college) => college.id).join(",")}`;
    void navigator.clipboard.writeText(url);
    toast.success("Comparison link copied");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </main>
    );
  }

  if (selected.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-20">
        <div className="mx-auto max-w-md rounded-[8px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[8px] bg-brand-goldLight text-brand-navy">
            <Plus className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Your compare tray is empty
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Browse colleges and tap + Compare to add up to three options here.
          </p>
          <Link
            href="/colleges"
            className="mt-8 inline-flex rounded-[6px] bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-goldHover"
          >
            Browse colleges
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              Compare options
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              Compare colleges
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Compare fees, placements, ranking, courses, and location side by
              side.
            </p>
          </div>
          <button
            onClick={share}
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-goldLight"
          >
            <Share2 className="h-4 w-4" />
            Share comparison
          </button>
        </div>

        <div className="overflow-x-auto rounded-[8px] border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-48 p-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Details
                </th>
                {selected.map((college) => (
                  <CollegeHeader
                    key={college.id}
                    college={college}
                    onRemove={handleRemove}
                  />
                ))}
                {[...Array(3 - selected.length)].map((_, index) => (
                  <th
                    key={index}
                    className="w-64 border-l border-dashed border-slate-200 bg-slate-50/70 p-6 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Plus className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">
                      Add college
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricGroups.map((group) => (
                <>
                  <tr
                    key={`${group.title}-heading`}
                    className="border-y border-slate-200 bg-slate-100/85"
                  >
                    <td
                      colSpan={4}
                      className="p-3 text-xs font-bold uppercase tracking-wide text-slate-800"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <CompareRow
                      key={`${group.title}-${row.label}`}
                      row={row}
                      selected={selected}
                      emptyCount={3 - selected.length}
                    />
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <AddCollegeSearch
          ids={ids}
          selectedLength={selected.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          searchResults={searchResults}
          handleAdd={handleAdd}
        />
      </div>
    </main>
  );
}

function CollegeHeader({
  college,
  onRemove
}: {
  college: any;
  onRemove: (id: string) => void;
}) {
  const stream = college.courses[0]?.type?.toLowerCase() ?? "default";
  return (
    <th className="w-64 border-l border-slate-100 p-4 align-top">
      <div className="space-y-3">
        <div className="relative flex h-16 items-center overflow-hidden rounded-[8px] bg-brand-navy px-4">
          <Image
            src={
              college.imageUrl ||
              `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`
            }
            alt={college.name}
            fill
            className="object-cover opacity-35"
            unoptimized
          />
          <span className="relative z-10 truncate pr-4 text-sm font-semibold text-white">
            {college.name}
          </span>
          <button
            onClick={() => onRemove(college.id)}
            className="relative z-10 ml-auto rounded-full p-1 text-white/75 transition hover:bg-white/10 hover:text-white"
            aria-label={`Remove ${college.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/colleges/${college.slug}`}
            className="text-xs font-semibold text-brand-navy hover:text-brand-gold"
          >
            View detail
          </Link>
          <span className="truncate text-[10px] text-slate-400">
            {college.city}, {college.state}
          </span>
        </div>
      </div>
    </th>
  );
}

function CompareRow({
  row,
  selected,
  emptyCount
}: {
  row: any;
  selected: any[];
  emptyCount: number;
}) {
  const numericValues = selected.map((college) => {
    if (row.label === "Min Annual Fee") return college.annualFeesMin;
    if (row.label === "Average Package") return college.avgPackageLPA || 0;
    if (row.label === "Placement Rate") return college.placementPercent || 0;
    return null;
  });
  const bestValue = row.lowerIsBetter
    ? Math.min(
        ...numericValues.filter(
          (value): value is number => typeof value === "number"
        )
      )
    : row.higherIsBetter
      ? Math.max(
          ...numericValues.filter(
            (value): value is number => typeof value === "number"
          )
        )
      : null;

  return (
    <tr className="bg-white transition hover:bg-slate-50/70">
      <td className="p-4 font-semibold text-slate-500">{row.label}</td>
      {selected.map((college, index) => {
        const isBest =
          bestValue !== null &&
          numericValues[index] === bestValue &&
          bestValue > 0;
        return (
          <td
            key={college.id}
            className={cn(
              "border-l border-slate-100 p-4 text-slate-700",
              isBest && "bg-brand-goldLight font-semibold text-brand-navy"
            )}
          >
            <span className="leading-6">{row.value(college)}</span>
            {isBest && (
              <span className="mt-1 block text-[10px] uppercase tracking-wide text-brand-gold">
                Strong option
              </span>
            )}
          </td>
        );
      })}
      {[...Array(emptyCount)].map((_, index) => (
        <td
          key={index}
          className="border-l border-dashed border-slate-200 bg-slate-50/50 p-4"
        />
      ))}
    </tr>
  );
}

function AddCollegeSearch({
  ids,
  selectedLength,
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  handleAdd
}: {
  ids: string[];
  selectedLength: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearching: boolean;
  searchResults: any[];
  handleAdd: (college: any) => void;
}) {
  if (selectedLength >= 3) return null;

  return (
    <div className="mt-8 rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-950">
        Add a college to compare
      </h3>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="compare-search-input"
          type="text"
          placeholder="Search by college name, stream, or city..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-11 w-full rounded-[6px] border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-gold focus:bg-white"
        />
      </div>

      {searchQuery.trim().length > 0 && (
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {isSearching ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-brand-gold" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="py-2 text-xs text-slate-400">
              No colleges found matching &quot;{searchQuery}&quot;
            </p>
          ) : (
            searchResults.map((college) => {
              const isAlreadyAdded = ids.includes(college.id);
              return (
                <div
                  key={college.id}
                  className="flex items-center justify-between gap-3 rounded-[8px] p-2 transition hover:bg-slate-50"
                >
                  <div className="truncate">
                    <h4 className="truncate text-xs font-bold text-slate-950">
                      {college.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {college.city}, {college.state}
                    </p>
                  </div>
                  <button
                    disabled={isAlreadyAdded}
                    onClick={() => handleAdd(college)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-[6px] border px-3 text-[10px] font-semibold transition",
                      isAlreadyAdded
                        ? "border-slate-200 bg-slate-100 text-slate-400"
                        : "border-brand-gold/30 bg-brand-goldLight text-brand-navy hover:bg-brand-gold hover:text-white"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                    {isAlreadyAdded ? "Added" : "Add"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
