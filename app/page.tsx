import {
  Search,
  Scale,
  Heart,
  Sparkles,
  Laptop,
  Stethoscope,
  Briefcase,
  Gavel,
  Palette,
  FlaskConical,
  Coins,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  TrendingUp,
  Quote,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { CollegeCard } from "@/components/college/CollegeCard";
import { mapCollege } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  // Query the top 3 highest-rated colleges for the spotlight section
  const dbColleges = await prisma.college.findMany({
    take: 3,
    orderBy: {
      rating: "desc"
    },
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

  const discoveryStreams = [
    { label: "Engineering", icon: Laptop, href: "/colleges?course=Engineering", stats: "24 Colleges", package: "₹18.5 LPA Avg", color: "from-blue-500 to-indigo-650" },
    { label: "Medical", icon: Stethoscope, href: "/colleges?course=Medical", stats: "12 Colleges", package: "₹24.0 LPA Avg", color: "from-red-500 to-rose-600" },
    { label: "Management", icon: Briefcase, href: "/colleges?course=Management", stats: "18 Colleges", package: "₹22.8 LPA Avg", color: "from-amber-500 to-orange-600" },
    { label: "Law", icon: Gavel, href: "/colleges?course=Law", stats: "8 Colleges", package: "₹15.2 LPA Avg", color: "from-purple-500 to-violet-600" },
    { label: "Science", icon: FlaskConical, href: "/colleges?course=Science", stats: "15 Colleges", package: "₹9.8 LPA Avg", color: "from-emerald-500 to-teal-600" },
    { label: "Arts & Humanities", icon: Palette, href: "/colleges?course=Arts", stats: "10 Colleges", package: "₹8.5 LPA Avg", color: "from-pink-500 to-fuchsia-600" },
    { label: "Commerce", icon: Coins, href: "/colleges?course=Commerce", stats: "12 Colleges", package: "₹11.2 LPA Avg", color: "from-cyan-500 to-sky-650" }
  ];

  const quickTags = [
    { label: "IIT Delhi", href: "/colleges?search=IIT+Delhi" },
    { label: "NIT Trichy", href: "/colleges?search=NIT+Trichy" },
    { label: "AIIMS Delhi", href: "/colleges?search=AIIMS+Delhi" },
    { label: "MBA", href: "/colleges?search=MBA" },
    { label: "Computer Science", href: "/colleges?search=Computer+Science" },
    { label: "Under ₹2L/yr", href: "/colleges?maxFees=200000" }
  ];

  const testimonials = [
    {
      name: "Aarav Mehta",
      college: "NIT Trichy, CSE Alumni",
      body: "CollegeCompass helped me compare options and realize NIT Trichy had better CSE placement percentages than several IIT branches. Saved me lakhs in fees!",
      rating: 5,
      avatarBg: "bg-blue-600"
    },
    {
      name: "Priya Sharma",
      college: "AIIMS Delhi, MBBS",
      body: "Comparing AIIMS vs CMC Vellore was super clean. The detailed hostels reviews and actual seat breakdown are incredibly accurate.",
      rating: 5,
      avatarBg: "bg-rose-600"
    },
    {
      name: "Kabir Sen",
      college: "IIM Ahmedabad, MBA Candidate",
      body: "The zero-sponsored marketing policy is real. No annoying counseling spam calls or emails. Just clean, raw student placement statistics.",
      rating: 5,
      avatarBg: "bg-amber-600"
    }
  ];

  return (
    <main className="bg-slate-50/50 min-h-screen text-slate-800">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-navyMid to-brand-navyDeep py-16 lg:py-28 text-white overflow-hidden dot-grid border-b border-white/5 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Content Column */}
            <div className="space-y-6 lg:max-w-xl">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-orange-400 border border-brand-orange/25 rounded-full text-xs px-3.5 py-1.5 font-bold tracking-wide uppercase select-none animate-pulse">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span>India&apos;s Premium Student Guide</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Compare colleges.<br />
                <span className="text-brand-orange">Discover your path.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Real placement brochures, unmoderated student reviews, and direct fee comparison filters. Built for students, zero sponsored spam.
              </p>

              {/* Search Block Container */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 shadow-xl">
                <form action="/colleges" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-xl p-1 shadow-md">
                  <div className="flex items-center flex-1 min-w-0">
                    <Search className="h-5 w-5 text-gray-400 ml-3.5 flex-shrink-0" />
                    <input
                      name="search"
                      className="w-full text-sm text-gray-900 bg-transparent outline-none px-3.5 py-2.5 sm:py-0 placeholder-gray-400"
                      placeholder="Search IITs, B.Tech, MBA, Delhi..."
                      aria-label="Search colleges"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orangeHover text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all flex-shrink-0 shadow-md active:scale-95"
                  >
                    Find College
                  </button>
                </form>
              </div>

              {/* Popular Tags */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-xs text-slate-500 font-semibold select-none whitespace-nowrap">Trending:</span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:border-brand-orange hover:text-white hover:bg-brand-orange/20 transition-all whitespace-nowrap"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Interactive Mock Column */}
            <div className="relative">
              {/* Soft atmospheric blur overlay */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-orange to-indigo-500 opacity-20 blur-3xl pointer-events-none" />
              
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-3 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/landing_hero.png"
                    alt="CollegeCompass Discovery Dashboard Mockup"
                    fill
                    priority
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Glassmorphic floating tags */}
                <div className="absolute -bottom-2 -left-2 bg-brand-navyMid/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm max-w-xs hover:-translate-y-1 transition-transform duration-300 select-none">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-emerald-500/10 text-emerald-450 rounded-xl">
                      <Scale className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Compare Hub</p>
                      <p className="text-xs font-bold text-white mt-0.5">IIT Bombay vs NIT Trichy</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 bg-brand-navyMid/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm max-w-xs hover:-translate-y-1 transition-transform duration-300 select-none">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-brand-orange/15 text-brand-orange rounded-xl">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Spotlight Recommendation</p>
                      <p className="text-xs font-bold text-white mt-0.5">Best Placement Value</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Core Stats Panel */}
          <div className="border-t border-white/5 mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "512", label: "Colleges Indexed" },
              { value: "28", label: "States Covered" },
              { value: "60,000+", label: "Student Reviews" },
              { value: "100%", label: "Verified Data" }
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: STREAM DISCOVERY HUB */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore by Stream</h2>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
            Navigate directly to customized listings filtered by academic interest, displaying local statistics and median placement salaries.
          </p>
        </div>

        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {discoveryStreams.map((stream) => {
            const IconComponent = stream.icon;
            return (
              <Link
                key={stream.label}
                href={stream.href}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-gray-200 bg-white hover:border-brand-orange hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stream.color} text-white mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-brand-orange transition-colors">
                    {stream.label}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-[10px] font-semibold text-slate-400">{stream.stats}</p>
                  <p className="text-[10px] font-bold text-slate-600">{stream.package}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: FEATURED COLLEGES SPOTLIGHT */}
      <section className="bg-slate-100/50 border-y border-slate-200/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="h-4 w-4" />
                <span>Featured Spotlights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Top Rated Indian Campuses</h2>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-500">Premium institutes matching top ratings, established infrastructure, and student reviews.</p>
            </div>
            
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-orangeHover group"
            >
              <span>Explore all colleges</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY COLLEGECOMPASS BENTO GRID */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Redefining College Selection</h2>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
            We bypass sponsored ads and biased rankings. Here is how we verify raw academic facts and metrics.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-6 select-none">
          
          {/* Bento Card 1: Verified Student Reviews (Wide) */}
          <div className="md:col-span-4 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-brand-orange/30">
            <div>
              <span className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl inline-block mb-6 group-hover:bg-indigo-100 transition-colors">
                <Users className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">Unmoderated Student Reviews</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                Read authentic testimonials and warnings direct from verify graduates. Discover facts regarding hostel conditions, campus placements, and direct classroom quality, completely free of sponsored marketing censorship.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-lg font-extrabold text-slate-800">100% Verified</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mt-0.5">Alumni Profile Checks</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-800">Unmoderated</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mt-0.5">Zero Marketing Influence</p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Compare Tool (Square) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-brand-orange/30">
            <div>
              <span className="p-3 bg-emerald-50 text-emerald-650 rounded-2xl inline-block mb-6 group-hover:bg-emerald-100 transition-colors">
                <Scale className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">Compare Matrix</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Contrast parameters side by side: tuition packages, campus area, highest CTC, and location.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/compare" className="text-xs font-bold text-brand-orange flex items-center gap-1 group-hover:underline">
                <span>Try Compare now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3: Shortlist (Square) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-brand-orange/30">
            <div>
              <span className="p-3 bg-rose-50 text-rose-650 rounded-2xl inline-block mb-6 group-hover:bg-rose-100 transition-colors">
                <Heart className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">Optimistic Saves</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Organize backups with instant React Query sync. No slow loaders or double taps.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/saved" className="text-xs font-bold text-brand-orange flex items-center gap-1 group-hover:underline">
                <span>View Shortlists</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4: Integrity Guarantee (Wide) */}
          <div className="md:col-span-4 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-brand-orange/30">
            <div>
              <span className="p-3 bg-amber-50 text-amber-650 rounded-2xl inline-block mb-6 group-hover:bg-amber-100 transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">100% Free & Anti-Spam Guarantee</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                We collect direct college reports. We do not sell student phone numbers to call centers, and we do not rank universities based on advertisement money. Clean, authentic student stats.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-100">
              {["No Spam calls", "No Sponsored Ads", "Authentic Brochures", "Secure Accounts"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider select-none">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: PLACEMENT & RECRUITERS TRACKER */}
      <section className="bg-slate-900 py-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-3 lg:items-center">
            
            {/* Left Header info */}
            <div className="space-y-4 lg:col-span-1">
              <div className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="h-4 w-4" />
                <span>Placement Tracker</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Verified Placement Outcomes</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Direct metrics fetched from certified brochures of universities. High CTCs, median packages, and prominent industry connections compared side-by-side.
              </p>
            </div>

            {/* Right outcome cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
              
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Highest CTC package</span>
                  <Award className="h-5 w-5 text-brand-orange" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">₹1.15 Crore</p>
                <p className="text-[10px] text-slate-500 mt-1">Statically verified from top Engineering IIT brochures</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-orange/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Average Placement Rate</span>
                  <GraduationCap className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">89.5%</p>
                <p className="text-[10px] text-slate-500 mt-1">Combined placement statistics for Management & Engineering streams</p>
              </div>

            </div>
          </div>

          {/* Scrolling Recruiters marquee bar */}
          <div className="border-t border-white/5 mt-12 pt-8 flex items-center justify-between gap-6 overflow-hidden flex-wrap text-slate-500 select-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-4">Prominent Recruiters:</span>
            {["Google", "Microsoft", "Amazon", "Deloitte", "Apollo Hospital", "Fortis", "Medanta", "Max Healthcare", "McKinsey", "Tata Consultancy Services"].map((rec) => (
              <span key={rec} className="text-xs font-bold text-slate-300 hover:text-brand-orange transition-colors">
                {rec}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: STUDENT TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex p-2 bg-brand-orange/10 text-brand-orange rounded-xl mb-3">
            <Quote className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Genuine Success Stories</h2>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
            Read comments from students who used CollegeCompass to find their backups and target colleges.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-brand-orange/20 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(test.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &quot;{test.body}&quot;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm", test.avatarBg)}>
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{test.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: PREMIUM FOOTER CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-8 py-16 text-white text-center shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          {/* Subtle warm orange lighting glow */}
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-brand-orange/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-orange/20 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-2xl relative z-10 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Start building your shortlist today
            </h2>
            <p className="text-sm text-slate-350 max-w-md mx-auto leading-relaxed">
              Unlock the compare tool, read authentic reviews, and organize backups. Completely free.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/colleges"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orangeHover px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/15 transition-all duration-150 active:scale-95"
              >
                Browse Colleges
              </Link>
              <Link
                href="/compare"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 px-8 py-3.5 text-sm font-bold text-white border border-white/10 transition-all duration-150 active:scale-95"
              >
                Try Compare Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
