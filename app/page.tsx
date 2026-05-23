import { Search, Scale, Heart, GraduationCap } from "lucide-react";
import Link from "next/link";

import { CollegeCard } from "@/components/college/CollegeCard";
import { mapCollege } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const dbColleges = await prisma.college.findMany({
    take: 6,
    include: {
      courses: true,
      reviews: {
        include: {
          user: { select: { name: true } }
        }
      }
    }
  });
  const featured = dbColleges.map(mapCollege);

  return (
    <main>
      <section className="border-b bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-sm text-slate-600 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">
              <GraduationCap className="h-4 w-4 text-primary" />
              500+ colleges across India
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              CollegeCompass
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-650 dark:text-slate-300">
              Find your perfect college. Make your best decision.
            </p>
            <form action="/colleges" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg border bg-white p-2 shadow-soft dark:bg-slate-900 sm:flex-row">
              <label className="sr-only" htmlFor="home-search">
                Search colleges
              </label>
              <input
                id="home-search"
                name="search"
                className="min-h-12 flex-1 rounded-md border-0 bg-transparent px-4 text-base outline-none"
                placeholder="Search by college, city, course..."
              />
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 font-semibold text-white transition hover:bg-blue-700">
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>500+ colleges</span>
              <span>20+ states</span>
              <span>50K+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Featured colleges</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">Curated institutions with strong outcomes.</p>
          </div>
          <Link className="text-sm font-semibold text-primary hover:underline" href="/colleges">
            Browse all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      <section className="border-y bg-slate-50 py-12 dark:bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Search", Search, "Filter by state, fees, courses, rating, and ranking."],
            ["Compare", Scale, "Shortlist up to three colleges and inspect differences side by side."],
            ["Save", Heart, "Keep dream colleges and backup options in organized collections."]
          ].map(([title, Icon, body]) => (
            <div key={String(title)} className="rounded-lg border bg-white p-6 dark:bg-slate-950">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{title as string}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
