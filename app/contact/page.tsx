import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with the UniVerdict support team."
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@univerdict.app",
    note: "Best for detailed queries"
  },
  {
    icon: Clock,
    title: "Response time",
    detail: "Within 24 hours",
    note: "Monday to Saturday, 9am to 6pm IST"
  },
  {
    icon: MapPin,
    title: "Based in",
    detail: "India",
    note: "Serving students nationwide"
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-slate-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-goldLight px-3 py-1.5 text-xs font-semibold text-brand-navy">
            <MessageCircle className="h-3.5 w-3.5" />
            Support
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Questions about a listing, data correction, account access, or a
            college you want added? Send the details and we will get back to
            you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {contactMethods.map(({ icon: Icon, title, detail, note }) => (
          <div
            key={title}
            className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Icon className="h-5 w-5 text-brand-navy" />
            <h2 className="mt-4 text-sm font-semibold text-slate-950">
              {title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-brand-navy">
              {detail}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-16">
        <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
            Send a message
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share enough detail so support can help quickly.
          </p>

          <form className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Your name" placeholder="Aarav Mehta" />
              <Field
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <Field
              id="subject"
              label="Subject"
              placeholder="Data correction for a college"
            />
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="h-11 w-full rounded-[6px] border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              >
                <option value="">Select a category</option>
                <option value="data">Data correction</option>
                <option value="account">Account issue</option>
                <option value="college">College listing request</option>
                <option value="review">Review flagging</option>
                <option value="other">General inquiry</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Describe your issue or query..."
                className="w-full resize-none rounded-[6px] border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-[6px] bg-brand-gold py-3 text-sm font-semibold text-white transition hover:bg-brand-goldHover"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text"
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-[6px] border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
      />
    </div>
  );
}
