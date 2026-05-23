import type { Metadata } from "next";
import { Compass, Users, ShieldCheck, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | UniVerdict",
  description:
    "Learn about UniVerdict — India's honest college discovery platform built to help students make unbiased, data-driven decisions."
};

const values = [
  {
    icon: ShieldCheck,
    title: "Zero Sponsored Rankings",
    body: "We never accept payments to boost a college's ranking. Every metric you see is pulled from certified placement brochures, NIRF data, and verified student reviews."
  },
  {
    icon: Users,
    title: "Built by Students, for Students",
    body: "Our founding team went through the same chaotic college selection process. We built UniVerdict to give every student the honest, unfiltered data we wish we had."
  },
  {
    icon: TrendingUp,
    title: "Real Placement Data",
    body: "Placement CTCs, median salaries, and recruiter lists are verified directly against official college brochures — not marketing materials or press releases."
  },
  {
    icon: Compass,
    title: "Your Compass, Not Theirs",
    body: "UniVerdict's compass logo symbolises our mission: give students a true north — an honest guide through an industry full of noise and biased advice."
  }
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 px-4">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/25 rounded-full text-xs px-4 py-1.5 font-bold tracking-widest uppercase">
            <Compass className="h-3.5 w-3.5" />
            Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Helping India&apos;s students choose <span className="text-brand-gold">smarter</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            UniVerdict is India&apos;s first fully unsponsored college discovery platform. We collect raw placement brochures,
            verified alumni reviews, and direct fee breakdowns — so you get the real picture, not a paid one.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-slate-200 bg-brand-goldLight/40">
        <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "512+", label: "Colleges Indexed" },
            { value: "60,000+", label: "Student Reviews" },
            { value: "28", label: "States Covered" },
            { value: "100%", label: "Verified Data" }
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-brand-navy">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Our Story</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              UniVerdict was founded by a group of engineering and management graduates who were frustrated by the college
              discovery process in India. Every platform they used was riddled with sponsored placements, hidden paid
              rankings, and call-center harassment.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We decided to build the platform we wished existed — one where a student in a Tier-3 city has access to the
              exact same data as someone in a metro. Transparent, unbiased, and completely free.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Today, UniVerdict indexes over 500 colleges across India, covering Engineering, Medical, Management, Law,
              Arts, Science, Commerce, Architecture, and Pharmacy streams.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-navy p-10 text-white text-center space-y-4 shadow-gold">
            <Compass className="h-16 w-16 text-brand-gold mx-auto" />
            <p className="text-xl font-bold">&quot;Find your true north.&quot;</p>
            <p className="text-sm text-slate-300">
              The compass in our logo stands for exactly that — honest direction in a noisy world.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">What We Stand For</h2>
            <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">Four principles guide every decision we make.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300"
              >
                <span className="inline-flex p-3 rounded-2xl bg-brand-goldLight text-brand-gold mb-5">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy mb-4">Ready to find your college?</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Start exploring 500+ verified colleges. Compare fees, placements, and reviews — completely free.
        </p>
        <a
          href="/colleges"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navy hover:bg-brand-navyDeep text-white px-8 py-3.5 text-sm font-bold shadow-sm transition-all"
        >
          Explore Colleges
        </a>
      </section>
    </main>
  );
}
