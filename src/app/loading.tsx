import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8" role="status" aria-label="Loading content">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card p-4 space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

