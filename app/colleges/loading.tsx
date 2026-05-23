export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Skeleton header */}
      <div className="mb-8 space-y-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-[280px] h-[550px] bg-gray-200 rounded-2xl animate-pulse"></div>

        <div className="space-y-6">
          {/* Sort bar skeleton */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
          </div>

          {/* Cards grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden bg-white p-5 space-y-4 animate-pulse"
              >
                <div className="h-[72px] -mx-5 -mt-5 bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="flex gap-1.5 mt-2">
                  <div className="h-4 bg-gray-250 rounded w-14"></div>
                  <div className="h-4 bg-gray-250 rounded w-14"></div>
                  <div className="h-4 bg-gray-250 rounded w-14"></div>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
