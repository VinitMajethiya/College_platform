import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UniVerdict collects, uses, and protects student data."
};

const sections = [
  ["Information we collect", "We collect account details you provide, saved colleges, shortlists, reviews, and basic usage data needed to run and improve the platform."],
  ["How we use information", "We use data to provide college search, saved lists, authentication, support, security, and product improvements. We do not sell student data to colleges or marketing agencies."],
  ["Cookies", "UniVerdict uses functional cookies for sign-in and preferences. We do not use advertising cookies or third-party tracking pixels."],
  ["Data retention", "We retain account data while your account is active. If you request deletion, we remove personal information except where retention is legally required."],
  ["Your choices", "You can request access, correction, or deletion of your personal data by contacting privacy@univerdict.app."],
  ["Security", "We use reasonable safeguards such as secure authentication, HTTPS, and access controls, while recognizing that no internet system is perfectly risk-free."],
  ["Third-party services", "Authentication, email delivery, hosting, and database providers may process data on our behalf under their own security and privacy obligations."],
  ["Contact", "For privacy questions, email privacy@univerdict.app."]
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-goldLight px-3 py-1.5 text-xs font-semibold text-brand-navy">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: May 23, 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-7 text-slate-600">
            UniVerdict is built for students, so the default is simple: collect only what helps the product work, keep it protected, and avoid selling student data.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {sections.map(([title, content]) => (
            <section key={title} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{content}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
