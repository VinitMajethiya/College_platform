"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function CollegeSearch() {
  const params = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(params.get("search") ?? "");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      startTransition(() => router.push(`/colleges?${next.toString()}`));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [value, params, router, startTransition]);

  return (
    <label className="relative block">
      <span className="sr-only">Search colleges</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        className="h-12 w-full rounded-lg border bg-white pl-11 pr-4 text-base shadow-sm dark:bg-slate-950"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search college, city, or course"
      />
    </label>
  );
}
