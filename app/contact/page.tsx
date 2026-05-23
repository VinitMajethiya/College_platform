import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support | UniVerdict",
  description:
    "Get in touch with the UniVerdict support team. We typically respond within 24 hours."
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@univerdict.app",
    note: "Best for detailed queries"
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Within 24 hours",
    note: "Monday – Saturday, 9am–6pm IST"
  },
  {
    icon: MapPin,
    title: "Based In",
    detail: "India 🇮🇳",
    note: "Serving students nationwide"
  }
];

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/25 rounded-full text-xs px-4 py-1.5 font-bold tracking-widest uppercase">
            <MessageCircle className="h-3.5 w-3.5" />
            Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            We&apos;re here to <span className="text-brand-gold">help</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
            Have a question about a college listing, your account, or a data discrepancy? Reach out and we&apos;ll get back
            to you as quickly as possible.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="bg-brand-goldLight/40 border-b border-slate-200 py-12">
        <div className="mx-auto max-w-4xl px-4 grid sm:grid-cols-3 gap-6">
          {contactMethods.map(({ icon: Icon, title, detail, note }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
              <span className="inline-flex p-3 rounded-xl bg-brand-goldLight text-brand-gold mb-4">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-bold text-brand-navy">{title}</h3>
              <p className="text-sm font-semibold text-slate-700 mt-1">{detail}</p>
              <p className="text-[11px] text-slate-400 mt-1">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold text-brand-navy mb-2">Send a Message</h2>
          <p className="text-sm text-slate-500 mb-8">Fill out the form below and we&apos;ll respond within 24 hours.</p>

          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Aarav Mehta"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="e.g. Data correction for IIT Bombay"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all bg-white"
              >
                <option value="">Select a category</option>
                <option value="data">Data Discrepancy / Correction</option>
                <option value="account">Account / Login Issue</option>
                <option value="college">College Listing Request</option>
                <option value="review">Review Flagging</option>
                <option value="other">General Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Describe your issue or query in detail..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-navy hover:bg-brand-navyDeep text-white font-bold py-3.5 text-sm transition-all active:scale-95 shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
