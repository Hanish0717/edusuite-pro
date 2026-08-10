export function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* KPI Cards pulsing grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border/30 bg-card p-4 space-y-3 animate-pulse">
            <div className="size-8 rounded-xl bg-muted/40" />
            <div className="h-6 bg-muted/40 rounded w-1/2" />
            <div className="h-2.5 bg-muted/30 rounded w-5/6" />
          </div>
        ))}
      </div>

      {/* Grid of lists cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border/30 bg-card p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-muted/40 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4.5 bg-muted/40 rounded w-3/4" />
                <div className="h-2.5 bg-muted/30 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 border-t border-border/20 pt-3">
              <div className="h-3 bg-muted/40 rounded w-5/6" />
              <div className="h-3 bg-muted/30 rounded w-2/3" />
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full w-full" />
            <div className="flex items-center justify-between border-t border-border/20 pt-3">
              <div className="h-5 bg-muted/45 rounded-lg w-16" />
              <div className="h-3.5 bg-muted/30 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
