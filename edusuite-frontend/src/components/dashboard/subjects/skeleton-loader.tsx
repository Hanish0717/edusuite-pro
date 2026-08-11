import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse text-xs">
      {/* Stats skeleton loader */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border rounded-2xl bg-card flex flex-col items-center space-y-2">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>

      {/* Grid skeleton loader */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border rounded-2xl bg-card space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-3.5 w-1/3" />
              <div className="flex gap-1">
                <Skeleton className="h-4 w-10 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-3 gap-2 pt-3 border-t">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
