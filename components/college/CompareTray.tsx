"use client";

import { X, Plus, Scale } from "lucide-react";
import Link from "next/link";

import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/lib/utils";

export function CompareTray() {
  const items = useCompareStore((state) => state.items);
  const remove = useCompareStore((state) => state.remove);

  const hasItems = items.length > 0;
  const ids = items.map((item) => item.id).join(",");

  return (
    <aside
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 bg-brand-navy border-t border-white/10 px-6 py-4 transition-all duration-300 ease-out transform shadow-2xl",
        hasItems
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
      role="region"
      aria-label="Compare tray"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Title and Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 select-none">
            <Scale className="h-4 w-4 text-brand-orange" />
            Compare ({items.length}/3)
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/25 text-xs px-3.5 py-1.5 font-medium shadow-sm transition-all"
              >
                {item.name}
                <button
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.id)}
                  className="text-orange-300 hover:text-white rounded-full p-0.5 hover:bg-white/5 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {items.length < 3 && (
              <Link
                href="/colleges"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs px-3.5 py-1.5 border border-dashed border-white/10 hover:border-white/20 rounded-full transition-all"
              >
                <Plus className="h-3 w-3" />
                <span>Add college</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="flex-shrink-0 flex gap-2">
          {items.length >= 2 ? (
            <Link
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orangeHover px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/20"
              href={`/compare?ids=${ids}`}
            >
              Compare now
            </Link>
          ) : (
            <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed select-none border border-white/5">
              Add {2 - items.length} more to compare
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
