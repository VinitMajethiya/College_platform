import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Heart,
  Landmark,
  Laptop,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CollegeCard } from "@/components/college/CollegeCard";
import { mapCollege } from "@/lib/college-service";
import { prisma } from "@/lib/prisma";
import { colleges as sampleColleges } from "@/lib/sample-data";

export default async function HomePage() {
  let featured = sampleColleges
    .toSorted((first, second) => second.rating - first.rating)
    .slice(0, 3);

  try {
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

    if (dbColleges.length > 0) {
      featured = dbColleges.map(mapCollege);
    }
  } catch {
    // Keep the landing page useful in local/offline development.
  }

  const quickTags = [
    { label: "B.Tech", href: "/colleges?search=B.Tech" },
    { label: "MBA", href: "/colleges?search=MBA" },
    { label: "MBBS", href: "/colleges?search=MBBS" },
    { label: "Delhi", href: "/colleges?location=Delhi" },
    { label: "Under Rs 2L", href: "/colleges?maxFees=200000" }
  ];

  const streams = [
    {
      label: "Engineering",
      icon: Laptop,
      href: "/colleges?course=Engineering",
      detail: "Compare branches, fees, placements, and campus life."
    },
    {
      label: "Medical",
      icon: Stethoscope,
      href: "/colleges?course=Medical",
      detail: "Check seats, clinical exposure, city fit, and fees."
    },
    {
      label: "Management",
      icon: BriefcaseBusiness,
      href: "/colleges?course=Management",
      detail: "Review cohorts, recruiters, ROI, and internship access."
    },
    {
      label: "Law",
      icon: Landmark,
      href: "/colleges?course=Law",
      detail: "Find programs by reputation, location, and outcomes."
    },
    {
      label: "Science",
      icon: FlaskConical,
      href: "/colleges?course=Science",
      detail: "Explore research fit, labs, faculty, and next steps."
    },
    {
      label: "Arts",
      icon: BookOpen,
      href: "/colleges?course=Arts",
      detail: "Browse colleges by subject depth and student experience."
    }
  ];

  const decisionSteps = [
    {
      title: "Start with what matters",
      body: "Search by course, city, budget, entrance path, or college name.",
      icon: Search
    },
    {
      title: "Compare the tradeoffs",
      body: "Put fees, placements, ratings, location, and courses side by side.",
      icon: CheckCircle2
    },
    {
      title: "Save a clear shortlist",
      body: "Keep your targets, backups, and budget-safe options in one place.",
      icon: Heart
    }
  ];

  const proofPoints = [
    { value: "500+", label: "colleges indexed" },
    { value: "28", label: "states covered" },
    { value: "60k+", label: "student reviews" },
    { value: "0", label: "sponsored rankings" }
  ];

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <Image
          src="/images/engineering_campus_1779526314515.png"
          alt="Students walking across a college campus"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/68 to-slate-950/25" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              Built for students making real college decisions
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-5xl lg:text-6xl">
              College search for students
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Understand colleges quickly with clean comparisons, verified
              details, student reviews, fees, placements, and shortlists that
              make sense at admission time.
            </p>

            <form
              action="/colleges"
              method="GET"
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[8px] border border-white/16 bg-white p-2 shadow-soft sm:flex-row"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 text-slate-500">
                <Search className="h-5 w-5 flex-shrink-0" />
                <span className="sr-only">Search colleges</span>
                <input
                  name="search"
                  className="h-12 w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Search colleges, courses, cities, exams..."
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-brand-gold px-6 text-sm font-semibold text-white transition hover:bg-brand-goldHover"
              >
                Find colleges
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {quickTags.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-brand-gold hover:bg-brand-gold/18"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/14 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((item) => (
              <div
                key={item.label}
                className="rounded-[8px] bg-white/9 px-4 py-3 backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {decisionSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[8px] bg-brand-goldLight text-brand-navy">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              Explore streams
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              Find the path that fits your next few years
            </h2>
          </div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-gold"
          >
            Browse all colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => {
            const Icon = stream.icon;
            return (
              <Link
                key={stream.label}
                href={stream.href}
                className="group rounded-[8px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[8px] bg-slate-100 text-brand-navy transition group-hover:bg-brand-goldLight">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-slate-950">
                      {stream.label}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">
                      {stream.detail}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-gold">
                <Award className="h-4 w-4" />
                Student favourites
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                Start with highly rated colleges
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A quick look at colleges with strong ratings, useful details,
                and enough context to start comparing seriously.
              </p>
            </div>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-gold"
            >
              See directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              Why it feels calmer
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              Information that is easy to scan, compare, and trust
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              UniVerdict keeps the important admission signals visible without
              burying students under ads, vague rankings, or oversized claims.
              Every page is designed around the next useful decision.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-700">
              {[
                "Side-by-side comparison for fees, placements, ratings, and location",
                "Shortlists for target, backup, and budget-safe colleges",
                "Student-first language without counselling spam"
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[8px] border border-slate-200 bg-white p-6">
              <GraduationCap className="h-6 w-6 text-brand-navy" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                For admissions season
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Move from broad search to a practical shortlist without losing
                track of deadlines, costs, and course fit.
              </p>
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-white p-6">
              <MapPin className="h-6 w-6 text-brand-navy" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                Location aware
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Make city, distance, campus life, and daily affordability part
                of the decision from the beginning.
              </p>
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-white p-6 sm:col-span-2">
              <UsersRound className="h-6 w-6 text-brand-navy" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                Readable by students and parents
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Clean sections, plain labels, and direct comparisons help
                everyone understand the same information quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[8px] bg-brand-navy px-6 py-10 text-white sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Build a shortlist you can explain clearly.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Search colleges, compare the important numbers, and keep your best
              options ready before counselling or applications begin.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/colleges"
              className="inline-flex h-11 items-center justify-center rounded-[6px] bg-brand-gold px-5 text-sm font-semibold text-white transition hover:bg-brand-goldHover"
            >
              Browse colleges
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-11 items-center justify-center rounded-[6px] border border-white/18 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Compare options
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
