import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | UniVerdict",
  description: "UniVerdict's Terms of Service — the rules and guidelines for using our platform."
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using UniVerdict ("Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you may not use the Platform. These terms apply to all visitors, registered users, and any other parties who access the Platform.`
  },
  {
    title: "2. Description of Service",
    content: `UniVerdict is a college discovery platform that provides information about Indian educational institutions, including placement statistics, fee structures, student reviews, and comparison tools. The Platform is provided "as is" and "as available". We reserve the right to modify, suspend, or discontinue any part of the service at any time.`
  },
  {
    title: "3. User Accounts",
    content: `To access certain features (saving colleges, writing reviews), you must create an account. You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activity that occurs under your account
• Providing accurate and complete registration information
• Notifying us immediately of any unauthorised use of your account

You must be at least 13 years old to create an account.`
  },
  {
    title: "4. User-Generated Content",
    content: `Users may submit reviews, ratings, and comments about colleges ("User Content"). By submitting User Content, you:
• Grant UniVerdict a non-exclusive, royalty-free licence to display and use that content on the Platform
• Represent that the content is accurate to the best of your knowledge
• Agree not to submit false, misleading, or defamatory content
• Agree not to submit content that violates third-party rights

We reserve the right to remove any User Content that violates these Terms at our sole discretion.`
  },
  {
    title: "5. Prohibited Conduct",
    content: `You agree not to:
• Use the Platform for any unlawful purpose
• Attempt to gain unauthorised access to any part of the Platform or its infrastructure
• Scrape, crawl, or copy Platform content without prior written consent
• Submit spam, fake reviews, or misleading information
• Impersonate any person or entity
• Use the Platform to advertise or promote products or services without permission
• Interfere with or disrupt the integrity or performance of the Platform`
  },
  {
    title: "6. Intellectual Property",
    content: `All content on the Platform other than User Content — including text, graphics, logos, icons, and software — is the property of UniVerdict or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`
  },
  {
    title: "7. Disclaimer of Warranties",
    content: `UniVerdict provides information for general guidance only. College data, placement statistics, and fee information may change. We make no warranties, expressed or implied, about the accuracy, completeness, or reliability of any information on the Platform. Your use of the Platform is entirely at your own risk.`
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by law, UniVerdict shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform, even if we have been advised of the possibility of such damages.`
  },
  {
    title: "9. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts located in India.`
  },
  {
    title: "10. Changes to Terms",
    content: `We reserve the right to update these Terms at any time. We will notify users of material changes by updating the "Last Updated" date. Continued use of the Platform after changes constitutes acceptance of the revised Terms.`
  },
  {
    title: "11. Contact",
    content: `For questions regarding these Terms, contact us at:
Email: legal@univerdict.app
UniVerdict, India`
  }
];

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/25 rounded-full text-xs px-4 py-1.5 font-bold tracking-widest uppercase">
            <ScrollText className="h-3.5 w-3.5" />
            Legal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: May 23, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-slate-600 leading-relaxed mb-10 p-5 bg-brand-goldLight/50 border border-brand-gold/20 rounded-2xl">
          Please read these Terms of Service carefully before using UniVerdict. They govern your access to and use of our
          platform and constitute a legally binding agreement between you and UniVerdict.
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
