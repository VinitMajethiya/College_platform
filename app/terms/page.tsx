import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Rules and guidelines for using UniVerdict."
};

const sections = [
  [
    "Acceptance",
    "By using UniVerdict, you agree to these terms and our Privacy Policy. If you do not agree, do not use the platform."
  ],
  [
    "Service",
    "UniVerdict provides college discovery, comparison, saved lists, reviews, and related admission research tools. Information may change and should be verified with official college sources before final decisions."
  ],
  [
    "Accounts",
    "You are responsible for keeping your account secure and for activity under your account. You must provide accurate information when using account features."
  ],
  [
    "User content",
    "Reviews and comments should be honest, lawful, and based on real experience. We may remove content that is misleading, abusive, spammy, or violates rights."
  ],
  [
    "Prohibited conduct",
    "Do not scrape the platform, attempt unauthorized access, submit fake reviews, impersonate others, or disrupt the service."
  ],
  [
    "Intellectual property",
    "UniVerdict content, interface, logos, and software are protected. You may not copy or redistribute platform content without permission."
  ],
  [
    "No warranty",
    "The platform is provided as is. We aim for accuracy but do not guarantee that all college data, fees, placements, or dates are complete or current."
  ],
  [
    "Liability",
    "To the maximum extent permitted by law, UniVerdict is not liable for indirect or consequential losses related to platform use."
  ],
  ["Contact", "For legal questions, email legal@univerdict.app."]
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-goldLight px-3 py-1.5 text-xs font-semibold text-brand-navy">
            <ScrollText className="h-3.5 w-3.5" />
            Legal
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: May 23, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-7 text-slate-600">
            These terms explain how UniVerdict should be used and what students
            can expect from the platform.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {sections.map(([title, content]) => (
            <section
              key={title}
              className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{content}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
