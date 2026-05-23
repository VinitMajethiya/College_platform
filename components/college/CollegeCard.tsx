"use client";

import { Check, MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { SaveButton } from "@/components/saved/SaveButton";
import { College } from "@/lib/types";
import { formatCurrencyINR } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/lib/utils";

export function CollegeCard({ college }: { college: College }) {
  const addCompare = useCompareStore((state) => state.add);
  const removeCompare = useCompareStore((state) => state.remove);
  const isCompared = useCompareStore((state) => state.has(college.id));

  // Determine primary stream
  const courseTypes = college.courses.map((c) => c.type.toLowerCase());
  let stream = "default";
  if (courseTypes.includes("engineering")) stream = "engineering";
  else if (courseTypes.includes("medical")) stream = "medical";
  else if (courseTypes.includes("management")) stream = "management";
  else if (courseTypes.includes("law")) stream = "law";
  else if (
    courseTypes.includes("arts") ||
    courseTypes.includes("arts & humanities")
  )
    stream = "arts";
  else if (courseTypes.includes("science")) stream = "science";
  else if (courseTypes.includes("commerce")) stream = "commerce";
  else if (courseTypes.includes("architecture")) stream = "architecture";
  else if (courseTypes.includes("pharmacy")) stream = "pharmacy";

  const primaryCourseType = college.courses[0]?.type || "General";

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeCompare(college.id);
    } else {
      addCompare({
        id: college.id,
        slug: college.slug,
        name: college.name,
        city: college.city,
        state: college.state
      });
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft">
      <Link
        href={`/colleges/${college.slug}`}
        className="block relative h-32 overflow-hidden select-none"
      >
        <Image
          src={
            college.imageUrl ||
            `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`
          }
          alt={college.name}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/10" />
      </Link>

      {college.nirfRanking && college.nirfRanking <= 200 && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-navy shadow-sm backdrop-blur">
          NIRF #{college.nirfRanking}
        </span>
      )}
      <div className="absolute top-2.5 right-3 z-10">
        <SaveButton collegeId={college.id} compact />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/colleges/${college.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[44px] font-semibold leading-snug text-slate-950 transition-colors group-hover:text-brand-navy">
            {college.name}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            {college.city}, {college.state}
          </p>
        </Link>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-brand-navy">
            {primaryCourseType}
          </span>
          <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
            {formatCurrencyINR(college.annualFeesMin)}/yr
          </span>
          {college.avgPackageLPA && (
            <span className="rounded bg-brand-goldLight px-2 py-1 text-[10px] font-medium text-brand-navy">
              Avg {formatCurrencyINR(college.avgPackageLPA * 100000)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const isFilled = i < Math.round(college.rating);
                return (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      isFilled
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    )}
                  />
                );
              })}
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-700">
              {college.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
              ({college.reviewCount})
            </span>
          </div>

          <button
            onClick={handleCompareClick}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150",
              isCompared
                ? "border border-slate-200 bg-slate-100 text-slate-600"
                : "text-brand-navy hover:bg-brand-goldLight"
            )}
          >
            {isCompared ? (
              <>
                <Check className="h-3 w-3" />
                <span>Compared</span>
              </>
            ) : (
              <span>+ Compare</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
