import type { Metadata } from "next";
import { MapPin, Scale } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeDetailTabs } from "@/components/college/CollegeDetailTabs";
import { SaveButton } from "@/components/saved/SaveButton";
import { getRelatedColleges, getCollegeBySlug } from "@/lib/college-service";
import { formatFeeRange } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const college = await getCollegeBySlug(params.slug);
  if (!college) return {};

  return {
    title: college.name,
    description: `${college.name} admissions, courses, fees, placements, reviews, and rankings.`,
    openGraph: {
      title: `${college.name} | CollegeCompass`,
      description: `Compare ${college.name} fees, placements, reviews, and courses.`
    }
  };
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const college = await getCollegeBySlug(params.slug);
  if (!college) notFound();

  const related = await getRelatedColleges(college.slug);

  return (
    <main>
      <section className="border-b bg-gradient-to-br from-blue-700 via-sky-600 to-emerald-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-blue-50">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/colleges" className="hover:underline">
              Colleges
            </Link>{" "}
            / {college.name}
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight">{college.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-blue-50">
                <MapPin className="h-5 w-5" />
                {college.city}, {college.state}
              </p>
            </div>
            <div className="flex gap-3">
              <SaveButton collegeId={college.id} />
              <Link href={`/compare?ids=${college.id}`} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-slate-950">
                <Scale className="h-4 w-4" />
                Compare
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-3 rounded-lg bg-white/10 p-4 backdrop-blur sm:grid-cols-4">
            <Stat label="NIRF rank" value={college.nirfRanking ? `#${college.nirfRanking}` : "NA"} />
            <Stat label="Rating" value={`${college.rating.toFixed(1)} / 5`} />
            <Stat label="Fees" value={formatFeeRange(college.annualFeesMin, college.annualFeesMax)} />
            <Stat label="Placement" value={`${college.placementPercent}%`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CollegeDetailTabs college={college} />

        <section className="mt-12">
          <h2 className="mb-5 text-xl font-bold">Related colleges</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <CollegeCard key={item.id} college={item} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-blue-50">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
