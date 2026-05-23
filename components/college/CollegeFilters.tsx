"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const states = ["Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Telangana", "Kerala", "Gujarat", "West Bengal", "Haryana"];
const courses = ["Engineering", "Medical", "Management", "Arts", "Science", "Law"];

function toggleCsv(current: string | null, value: string) {
  const set = new Set((current ?? "").split(",").filter(Boolean));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set).join(",");
}

export function CollegeFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => router.push(`/colleges?${next.toString()}`));
  }

  return (
    <aside className="rounded-lg border bg-white p-4 dark:bg-slate-950 lg:sticky lg:top-20">
      <h2 className="font-semibold">Filters</h2>
      <div className="mt-5 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold">State</legend>
          <div className="mt-3 space-y-2">
            {states.map((state) => (
              <label key={state} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(params.get("state") ?? "").split(",").includes(state)}
                  onChange={() => update("state", toggleCsv(params.get("state"), state))}
                />
                {state}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">Course type</legend>
          <div className="mt-3 space-y-2">
            {courses.map((course) => (
              <label key={course} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(params.get("course") ?? "").split(",").includes(course)}
                  onChange={() => update("course", toggleCsv(params.get("course"), course))}
                />
                {course}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-semibold">
          Max annual fees
          <input
            className="mt-3 w-full"
            type="range"
            min="0"
            max="2000000"
            step="50000"
            value={params.get("maxFees") ?? "2000000"}
            onChange={(event) => update("maxFees", event.target.value)}
          />
        </label>

        <label className="block text-sm font-semibold">
          Minimum rating
          <select
            className="mt-3 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-950"
            value={params.get("minRating") ?? ""}
            onChange={(event) => update("minRating", event.target.value)}
          >
            <option value="">Any rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ stars
              </option>
            ))}
          </select>
        </label>
      </div>
    </aside>
  );
}
