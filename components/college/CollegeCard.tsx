"use client";

import { MapPin, Scale, Star } from "lucide-react";
import Link from "next/link";

import { SaveButton } from "@/components/saved/SaveButton";
import { College } from "@/lib/types";
import { formatFeeRange } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

export function CollegeCard({ college }: { college: College }) {
  const add = useCompareStore((state) => state.add);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-950">
      <Link href={`/colleges/${college.slug}`} className="block">
        <div className="h-28 bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-400" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/colleges/${college.slug}`} className="font-semibold leading-snug hover:text-primary">
              {college.name}
            </Link>
            <p className="mt-2 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4" />
              {college.city}, {college.state}
            </p>
          </div>
          <SaveButton collegeId={college.id} compact />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Annual fees</p>
            <p className="font-semibold">{formatFeeRange(college.annualFeesMin, college.annualFeesMax)}</p>
          </div>
          <div>
            <p className="text-slate-500">NIRF rank</p>
            <p className="font-semibold">{college.nirfRanking ? `#${college.nirfRanking}` : "NA"}</p>
          </div>
          <div>
            <p className="text-slate-500">Rating</p>
            <p className="flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {college.rating.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Courses</p>
            <p className="font-semibold">{college.courses.length}</p>
          </div>
        </div>
        <button
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          onClick={() =>
            add({
              id: college.id,
              slug: college.slug,
              name: college.name,
              city: college.city,
              state: college.state
            })
          }
        >
          <Scale className="h-4 w-4" />
          Compare
        </button>
      </div>
    </article>
  );
}
