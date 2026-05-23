import { Search, Scale, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

import { CollegeCard } from "@/components/college/CollegeCard";
import { mapCollege } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

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

  const streams = [
    { label: "All", href: "/colleges", active: true },
    { label: "Engineering", href: "/colleges?course=Engineering" },
    { label: "Medical", href: "/colleges?course=Medical" },
    { label: "Management", href: "/colleges?course=Management" },
    { label: "Law", href: "/colleges?course=Law" },
    { label: "Arts & Humanities", href: "/colleges?course=Arts" },
    { label: "Science", href: "/colleges?course=Science" }
  ];

  const quickTags = [
    { label: "IIT Delhi", href: "/colleges?search=IIT+Delhi" },
    { label: "NIT Trichy", href: "/colleges?search=NIT+Trichy" },
    { label: "AIIMS Delhi", href: "/colleges?search=AIIMS+Delhi" },
    { label: "MBA", href: "/colleges?search=MBA" },
    { label: "Computer Science", href: "/colleges?search=Computer+Science" },
    { label: "Under ₹2L/yr", href: "/colleges?maxFees=200000" }
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* Section 1: Hero */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-navyMid to-brand-navyDeep py-20 text-white overflow-hidden dot-grid border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Top Badge */}
            <div className="mb-6 inline-flex items-center gap-2 bg-brand-orange/10 text-orange-400 border border-brand-orange/20 rounded-full text-xs px-3.5 py-1.5 font-medium select-none">
              <Sparkles className="h-3.5 w-3.5" />
              <span>India&apos;s student-first college guide</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
              Right guidance,<br />
              <span className="text-brand-orange">brighter future.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
              Real placement data, honest reviews, and zero sponsored fluff. Find your college without the noise.
            </p>

            {/* Search Card Container */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 max-w-2xl mt-8">
              <form action="/colleges" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-xl p-1.5 shadow-md">
                <div className="flex items-center flex-1 min-w-0">
                  <Search className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
                  <input
                    name="search"
                    className="w-full text-sm text-gray-900 bg-transparent outline-none px-3 py-2 sm:py-0"
                    placeholder="Search college name, course, city, or exam..."
                    aria-label="Search colleges"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orangeHover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Access Tags */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs text-slate-500 font-medium select-none whitespace-nowrap">Popular:</span>
              {quickTags.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/10 hover:border-brand-orange/40 hover:text-brand-orange transition-all whitespace-nowrap"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="border-t border-white/5 mt-12 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "512", label: "Colleges indexed" },
                { value: "28", label: "States covered" },
                { value: "60,000+", label: "Student reviews" },
                { value: "100%", label: "Free forever" }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Stream Filter + Featured Colleges */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Stream pills filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 border-b border-gray-200/60">
          {streams.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className={cn(
                "text-xs font-semibold px-4.5 py-2 rounded-full transition-all duration-150 whitespace-nowrap border",
                pill.active
                  ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:text-brand-orange"
              )}
            >
              {pill.label}
            </Link>
          ))}
        </div>

        {/* Section Heading */}
        <div className="mt-10 mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Featured Colleges</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">Curated Indian universities with proven career track records.</p>
          </div>
          <Link
            className="text-xs sm:text-sm font-semibold text-brand-orange hover:text-brand-orangeHover flex items-center gap-1"
            href="/colleges"
          >
            <span>View all colleges</span>
            <span>→</span>
          </Link>
        </div>

        {/* College Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="bg-white border-y border-gray-250/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Choosing a college just got easier</h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">All the research tools you need to compare, review, and decide—completely free.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Search & filter",
                description: "Find colleges by stream, annual fees, locations, and government ratings.",
                icon: Search
              },
              {
                title: "Compare side by side",
                description: "Inspect up to three colleges together. Contrast placement packages, fees, and campus sizes.",
                icon: Scale
              },
              {
                title: "Save your shortlist",
                description: "Organize dream options. Create a free account to save backup universities across devices.",
                icon: Heart
              }
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-start p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-all duration-200">
                  <span className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange mb-4">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-semibold text-gray-900 text-base">{step.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: CTA Banner */}
      <section className="bg-brand-orange py-16 text-white text-center relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl font-semibold text-white leading-snug">
            Start building your college list — it&apos;s free.
          </h2>
          <p className="text-sm text-orange-100 max-w-md mx-auto">
            No expensive counsellors. No marketing spam. Just clean, honest student data.
          </p>
          <div className="pt-2">
            <Link
              href="/colleges"
              className="inline-flex items-center justify-center rounded-full bg-white hover:bg-orange-50 px-8 py-3.5 text-sm font-semibold text-brand-orange shadow-md transition-all duration-150 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
