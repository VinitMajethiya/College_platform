import { Mail } from "lucide-react";

import { signIn } from "@/lib/auth";

export default function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl ?? "/";

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-16">
      <div className="mx-auto max-w-md rounded-[8px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-brand-gold">Student account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Sign in to UniVerdict</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Save colleges, build shortlists, and continue your admission research across devices.
        </p>

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <button className="flex w-full items-center justify-center rounded-[6px] bg-brand-gold px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-goldHover">
            Continue with Google
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or use email</span>
          </div>
        </div>

        <form
          className="space-y-3"
          action={async (formData) => {
            "use server";
            const email = formData.get("email");
            await signIn("nodemailer", { email, redirectTo: callbackUrl });
          }}
        >
          <label htmlFor="email" className="sr-only">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="h-11 w-full rounded-[6px] border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
          <button className="w-full rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
            Send magic link
          </button>
        </form>
      </div>
    </main>
  );
}
