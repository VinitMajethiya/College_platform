"use client";

import { MapPin, Scale, Star, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { SaveButton } from "@/components/saved/SaveButton";
import { College } from "@/lib/types";
import { formatCurrencyINR } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";
import { getStreamGradient } from "@/lib/design-tokens";
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
  else if (courseTypes.includes("arts") || courseTypes.includes("arts & humanities")) stream = "arts";
  else if (courseTypes.includes("science")) stream = "science";
  else if (courseTypes.includes("commerce")) stream = "commerce";
  else if (courseTypes.includes("architecture")) stream = "architecture";
  else if (courseTypes.includes("pharmacy")) stream = "pharmacy";

  const gradient = getStreamGradient(stream);
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-200">
      
      {/* College Banner */}
      <Link href={`/colleges/${college.slug}`} className="block relative h-28 overflow-hidden select-none">
        <Image
          src={college.imageUrl || `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`}
          alt={college.name}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Rich gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
      </Link>

      {/* Absolute Badges on Banner */}
      {college.nirfRanking && college.nirfRanking <= 200 && (
        <span className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-10 shadow-sm uppercase tracking-wider">
          NIRF #{college.nirfRanking}
        </span>
      )}
      <div className="absolute top-2.5 right-3 z-10">
        <SaveButton collegeId={college.id} compact />
      </div>

      {/* College Info Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/colleges/${college.slug}`} className="block">
          <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-brand-orange transition-colors line-clamp-1">
            {college.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3.5 w-3.5 inline-block text-gray-400" />
            {college.city}, {college.state}
          </p>
        </Link>

        {/* Info Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded">
            {primaryCourseType}
          </span>
          <span className="bg-green-50 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded">
            {formatCurrencyINR(college.annualFeesMin)}/yr
          </span>
          {college.avgPackageLPA && (
            <span className="bg-orange-50 text-orange-700 text-[10px] font-medium px-2 py-0.5 rounded">
              Avg {formatCurrencyINR(college.avgPackageLPA * 100000)}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const isFilled = i < Math.round(college.rating);
                return (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      isFilled ? "fill-amber-400 text-amber-400" : "text-gray-200"
                    )}
                  />
                );
              })}
            </span>
            <span className="text-xs font-semibold text-gray-700 ml-1">{college.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({college.reviewCount})</span>
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            className={cn(
              "text-xs font-medium transition-all duration-150 flex items-center gap-1 py-1 px-2.5 rounded-full",
              isCompared
                ? "bg-slate-100 text-slate-600 border border-slate-200"
                : "text-brand-orange hover:bg-brand-orangeLight"
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
