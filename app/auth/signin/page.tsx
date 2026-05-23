import { Github } from "lucide-react";

import { signIn } from "@/lib/auth";

export default function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl ?? "/";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-950">
        <h1 className="text-2xl font-bold">Sign in to UniVerdict</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Save colleges and build collections across devices.</p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <button className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-white hover:bg-blue-700">Continue with Google</button>
        </form>
        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              Or continue with
            </span>
          </div>
        </div>
        <form
          className="flex flex-col gap-3"
          action={async (formData) => {
            "use server";
            const email = formData.get("email");
            await signIn("nodemailer", { email, redirectTo: callbackUrl });
          }}
        >
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full rounded-md border bg-transparent px-4 py-3 outline-none focus:border-primary"
          />
          <button className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900">
            Sign in with Email
          </button>
        </form>
      </div>
    </main>
  );
}
