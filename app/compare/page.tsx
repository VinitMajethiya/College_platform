import { Suspense } from "react";

import { CompareClient } from "@/components/college/CompareClient";

export default function ComparePage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">Loading comparison...</main>}>
      <CompareClient />
    </Suspense>
  );
}
