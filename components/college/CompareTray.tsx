"use client";

import { X } from "lucide-react";
import Link from "next/link";

import { useCompareStore } from "@/store/compareStore";

export function CompareTray() {
  const items = useCompareStore((state) => state.items);
  const remove = useCompareStore((state) => state.remove);

  if (items.length === 0) return null;

  const ids = items.map((item) => item.id).join(",");

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 p-3 shadow-soft backdrop-blur dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              {item.name}
              <button aria-label={`Remove ${item.name}`} onClick={() => remove(item.id)}>
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <Link className="rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700" href={`/compare?ids=${ids}`}>
          Compare now
        </Link>
      </div>
    </aside>
  );
}
