import Link from "next/link";

import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeFilters } from "@/components/college/CollegeFilters";
import { CollegeSearch } from "@/components/college/CollegeSearch";
import { SortSelect } from "@/components/college/SortSelect";
import { listColleges } from "@/lib/college-service";
import { collegeListQuerySchema } from "@/lib/validations/college";

export default async function CollegesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value ?? ""])
  );
  const query = collegeListQuerySchema.parse(params);
  const result = await listColleges(query);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover colleges</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Showing {result.colleges.length} of {result.pagination.total} colleges
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <CollegeFilters />
        <section>
          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
            <CollegeSearch />
            <SortSelect value={query.sort} />
          </div>

          {result.colleges.length === 0 ? (
            <div className="rounded-lg border bg-white p-10 text-center dark:bg-slate-950">
              <h2 className="text-xl font-semibold">No colleges found</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Try removing a filter or searching for a broader course.</p>
              <Link className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-white" href="/colleges">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {result.colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Link
              aria-disabled={query.page <= 1}
              className="rounded-md border px-4 py-2 text-sm font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50"
              href={`/colleges?${new URLSearchParams({ ...params, page: String(Math.max(1, query.page - 1)) })}`}
            >
              Previous
            </Link>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {result.pagination.page} of {result.pagination.totalPages}
            </span>
            <Link
              aria-disabled={query.page >= result.pagination.totalPages}
              className="rounded-md border px-4 py-2 text-sm font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50"
              href={`/colleges?${new URLSearchParams({ ...params, page: String(query.page + 1) })}`}
            >
              Next
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
