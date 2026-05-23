import type { Metadata } from "next";
import { ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeDetailTabs } from "@/components/college/CollegeDetailTabs";
import { getCollegeBySlug, getRelatedColleges } from "@/lib/college-service";
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
  const courseTypes = college.courses.map((course) => course.type.toLowerCase());
  let stream = "default";
  if (courseTypes.includes("engineering")) stream = "engineering";
  else if (courseTypes.includes("medical")) stream = "medical";
  else if (courseTypes.includes("management")) stream = "management";
  else if (courseTypes.includes("law")) stream = "law";

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="border-b border-slate-200 bg-white py-3.5">
        <nav className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 text-xs font-medium text-slate-400 sm:px-6 lg:px-8">
          <Link href="/" className="transition-colors hover:text-brand-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/colleges" className="transition-colors hover:text-brand-gold">Colleges</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="max-w-xs truncate font-normal text-slate-700">{college.name}</span>
        </nav>
      </div>

      <section className="relative overflow-hidden py-16 text-white">
        <Image
          src={college.imageUrl || `/images/colleges/${["engineering", "medical", "management", "law"].includes(stream) ? stream : "default"}.png`}
          alt={college.name}
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-brand-navy/72 to-slate-950/20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              {college.name}
            </h1>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-white/82">
              <MapPin className="h-4 w-4 flex-shrink-0 text-white/70" />
              <span>{college.city}, {college.state}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {college.nirfRanking && (
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  NIRF #{college.nirfRanking}
                </span>
              )}
              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {college.rating.toFixed(1)} stars
              </span>
              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                Est. {college.established}
              </span>
              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {formatFeeRange(college.annualFeesMin, college.annualFeesMax)}/yr
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CollegeDetailTabs college={college} />

        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-brand-gold">More to compare</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">Related colleges</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Similar institutions located near {college.state} or matching streams.
            </p>
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
