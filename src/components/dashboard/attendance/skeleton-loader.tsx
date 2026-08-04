import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse text-xs">
      {/* Stats loader */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border rounded-2xl bg-card flex flex-col items-center space-y-2">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>

      {/* Grid class loader */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border rounded-2xl bg-card space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-3.5 w-1/4" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1 rounded-xl" />
              <Skeleton className="h-8 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
