"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SortSelect({ value }: { value: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <select
      aria-label="Sort colleges"
      value={value}
      onChange={(event) => {
        const next = new URLSearchParams(params.toString());
        next.set("sort", event.target.value);
        next.delete("page");
        startTransition(() => router.push(`/colleges?${next.toString()}`));
      }}
      className="h-12 w-full rounded-lg border bg-white px-3 dark:bg-slate-950"
    >
      <option value="ranking">Ranking</option>
      <option value="fees-asc">Fees low-high</option>
      <option value="fees-desc">Fees high-low</option>
      <option value="rating">Rating</option>
      <option value="name">Name A-Z</option>
    </select>
  );
}
