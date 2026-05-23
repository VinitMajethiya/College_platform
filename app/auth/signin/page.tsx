import { Github } from "lucide-react";

import { signIn } from "@/lib/auth";

export default function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl ?? "/";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-950">
        <h1 className="text-2xl font-bold">Sign in to CollegeCompass</h1>
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
        <form
          className="mt-3"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: callbackUrl });
          }}
        >
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold hover:border-primary hover:text-primary">
            <Github className="h-4 w-4" />
            Continue with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
