"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Award, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/lib/utils";

type CollegeSearchResult = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  nirfRanking: number | null;
};

const POPULAR_SEARCHES = [
  "IIT Delhi",
  "NIT Trichy",
  "AIIMS Delhi",
  "MBA",
  "Computer Science",
  "Under ₹2L/yr"
];

export function SearchModal() {
  const router = useRouter();
  const { isOpen, close } = useSearchStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setSelectedIndex(-1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Escape key and keyboard arrows listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const { data, isLoading } = useQuery<{ colleges: CollegeSearchResult[] }>({
    queryKey: ["search-colleges", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { colleges: [] };
      const res = await fetch(
        `/api/colleges?search=${encodeURIComponent(debouncedQuery)}&pageSize=5`
      );
      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      return { colleges: json.data || [] };
    },
    enabled: isOpen && debouncedQuery.trim().length > 0
  });

  const colleges = data?.colleges || [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (colleges.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 >= colleges.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 < 0 ? colleges.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < colleges.length) {
        const selected = colleges[selectedIndex];
        router.push(`/colleges/${selected.slug}`);
        close();
      } else if (query.trim()) {
        router.push(`/colleges?search=${encodeURIComponent(query)}`);
        close();
      }
    }
  };

  const handlePopularSearchClick = (tag: string) => {
    if (tag.startsWith("Under")) {
      router.push(`/colleges?maxFees=200000`);
    } else if (tag === "Computer Science" || tag === "MBA") {
      router.push(`/colleges?search=${encodeURIComponent(tag)}`);
    } else {
      router.push(`/colleges?search=${encodeURIComponent(tag)}`);
    }
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24" onClick={close}>
      <div
        className="bg-white rounded-2xl w-full max-w-xl mx-4 overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input area */}
        <div className="relative border-b border-gray-100 flex items-center px-4">
          <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full py-4 text-base text-gray-900 bg-transparent outline-none focus:ring-0 placeholder-gray-400"
            placeholder="Search college name, course, city, or exam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search colleges"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          ) : (
            <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 flex-shrink-0 select-none">
              ESC
            </span>
          )}
        </div>

        {/* Results area */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5" ref={resultsContainerRef}>
          {query.trim().length === 0 ? (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handlePopularSearchClick(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orangeLight transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="space-y-2 flex-1 mr-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Colleges Found
              </h3>
              {colleges.map((college, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={college.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border border-transparent cursor-pointer transition-all",
                      isSelected
                        ? "bg-brand-orangeLight border-brand-orange/30 text-brand-orange"
                        : "hover:bg-gray-50 hover:border-gray-100 text-gray-900"
                    )}
                    onClick={() => {
                      router.push(`/colleges/${college.slug}`);
                      close();
                    }}
                  >
                    <div className="flex-1 mr-4">
                      <h4 className="text-sm font-medium leading-snug">{college.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 inline flex-shrink-0" />
                        {college.city}, {college.state}
                      </p>
                    </div>
                    {college.nirfRanking && (
                      <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-orange-50 text-brand-orange border border-orange-200/50 flex-shrink-0">
                        <Award className="h-3.5 w-3.5" />
                        <span>NIRF #{college.nirfRanking}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-gray-400">
              No colleges found for &quot;{debouncedQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
