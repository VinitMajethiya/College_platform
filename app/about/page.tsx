import type { Metadata } from "next";
import { Compass, ShieldCheck, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about UniVerdict, India's honest college discovery platform built to help students make unbiased decisions."
};

const values = [
  {
    icon: ShieldCheck,
    title: "No sponsored ranking",
    body: "We keep paid promotion out of college comparison so students can focus on the facts."
  },
  {
    icon: Users,
    title: "Built around student questions",
    body: "Fees, placements, location, courses, and reviews are arranged for quick admission decisions."
  },
  {
    icon: TrendingUp,
    title: "Outcome focused",
    body: "The platform highlights practical signals like ROI, recruiters, campus fit, and backups."
  },
  {
    icon: Compass,
    title: "Clear direction",
    body: "UniVerdict is designed to reduce confusion, not add another noisy counselling layer."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-goldLight px-3 py-1.5 text-xs font-semibold text-brand-navy">
            <Compass className="h-3.5 w-3.5" />
            Our mission
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl">
            Help students choose colleges with less noise and more clarity.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            UniVerdict brings college search, comparison, reviews, fees, and placements into a clean platform that students and parents can understand quickly.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
        {[
          { value: "500+", label: "colleges indexed" },
          { value: "60k+", label: "student reviews" },
          { value: "28", label: "states covered" },
          { value: "0", label: "sponsored rankings" }
        ].map((stat) => (
          <div key={stat.label} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-semibold text-brand-navy">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Our story</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">A college platform that feels usable during admission season</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            College discovery often becomes a maze of ads, vague rankings, and repeated calls. UniVerdict is built as a calmer alternative: search clearly, compare honestly, and keep your shortlist organized.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
              <Icon className="h-6 w-6 text-brand-navy" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[8px] bg-brand-navy p-8 text-white sm:p-10">
          <h2 className="text-2xl font-semibold tracking-normal">Ready to build your shortlist?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Explore verified colleges and compare the signals that matter before counselling or applications begin.
          </p>
          <Link href="/colleges" className="mt-6 inline-flex rounded-[6px] bg-brand-gold px-5 py-2.5 text-sm font-semibold text-white">
            Explore colleges
          </Link>
        </div>
      </section>
    </main>
  );
}
