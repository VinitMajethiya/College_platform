import type { Metadata } from "next";
import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeDetailTabs } from "@/components/college/CollegeDetailTabs";
import { getRelatedColleges, getCollegeBySlug } from "@/lib/college-service";
import { getStreamGradient } from "@/lib/design-tokens";
import { formatFeeRange } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const college = await getCollegeBySlug(params.slug);
  if (!college) return {};

  return {
    title: college.name,
    description: `${college.name} admissions, courses, fees, placements, reviews, and rankings.`,
    openGraph: {
      title: `${college.name} | UniVerdict`,
      description: `Compare ${college.name} fees, placements, reviews, and courses.`
    }
  };
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const college = await getCollegeBySlug(params.slug);
  if (!college) notFound();

  const related = await getRelatedColleges(college.slug);

  // Determine stream color
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

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-3.5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/colleges" className="hover:text-brand-orange transition-colors">Colleges</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-normal truncate max-w-xs">{college.name}</span>
        </nav>
      </div>

      {/* 2. Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Campus Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={college.imageUrl || `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`}
            alt={college.name}
            fill
            priority
            className="object-cover"
            unoptimized
          />
          {/* Rich glassmorphic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/10 via-transparent to-transparent opacity-90" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              {college.name}
            </h1>
            
            {/* Location */}
            <p className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-4.5 w-4.5 text-white/70 flex-shrink-0" />
              <span>{college.city}, {college.state}</span>
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {college.nirfRanking && (
                <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  NIRF #{college.nirfRanking}
                </span>
              )}
              <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                ★ {college.rating.toFixed(1)}
              </span>
              <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                Est. {college.established}
              </span>
              <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {formatFeeRange(college.annualFeesMin, college.annualFeesMax)}/yr
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detail Tabs Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CollegeDetailTabs college={college} />

        {/* Related Colleges */}
        <section className="mt-16 border-t border-gray-200/60 pt-12">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Related Colleges</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">Similar institutions located near {college.state} or matching streams.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CollegeCard key={item.id} college={item} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
