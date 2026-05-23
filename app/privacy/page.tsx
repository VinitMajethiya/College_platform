import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | UniVerdict",
  description: "UniVerdict's Privacy Policy — how we collect, use, and protect your personal data."
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account (name, email address), save colleges, or submit a review. We also collect usage data automatically, including your IP address, browser type, pages visited, and time spent on the platform. We do not collect sensitive personal information such as financial details or government IDs.`
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide and improve the UniVerdict platform
• Personalise your experience (saved colleges, shortlists)
• Send transactional emails such as sign-in links
• Detect and prevent fraud or abuse
• Analyse usage trends to improve features

We do not sell your personal information to third parties. We do not share your data with college institutions or their marketing agencies.`
  },
  {
    title: "3. Cookies and Tracking",
    content: `UniVerdict uses minimal, functional cookies required to keep you signed in and maintain your saved preferences. We do not use advertising cookies or third-party tracking pixels. You can disable cookies in your browser settings, but this may affect certain features like staying logged in.`
  },
  {
    title: "4. Data Retention",
    content: `We retain your account data for as long as your account remains active. If you delete your account, we will remove your personal information within 30 days, except where retention is required by law. Anonymised, aggregated data (e.g. usage statistics) may be retained indefinitely.`
  },
  {
    title: "5. Your Rights",
    content: `You have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your account and associated data
• Withdraw consent for data processing where applicable
• Lodge a complaint with your local data protection authority

To exercise these rights, contact us at privacy@univerdict.app.`
  },
  {
    title: "6. Security",
    content: `We implement industry-standard security measures including HTTPS encryption, secure authentication via OAuth and email magic links, and access controls. No method of transmission over the internet is 100% secure, but we take reasonable precautions to protect your data.`
  },
  {
    title: "7. Third-Party Services",
    content: `UniVerdict uses the following third-party services:
• Authentication providers (Google OAuth) — subject to Google's Privacy Policy
• Email delivery service for magic-link sign-in
• Hosting and database infrastructure

These services may process data on our behalf under data processing agreements.`
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. When we make material changes, we will update the "Last Updated" date at the top of this page. Continued use of UniVerdict after changes constitutes acceptance of the updated policy.`
  },
  {
    title: "9. Contact Us",
    content: `For privacy-related questions, please contact us at:
Email: privacy@univerdict.app
UniVerdict, India`
  }
];

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/25 rounded-full text-xs px-4 py-1.5 font-bold tracking-widest uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: May 23, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-slate-600 leading-relaxed mb-10 p-5 bg-brand-goldLight/50 border border-brand-gold/20 rounded-2xl">
          UniVerdict (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read
          it carefully.
        </p>

        <div className="space-y-10">
          {sections.map(({ title, content }) => (
            <div key={title} className="border-b border-slate-100 pb-8 last:border-none last:pb-0">
              <h2 className="text-lg font-bold text-brand-navy mb-3">{title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
