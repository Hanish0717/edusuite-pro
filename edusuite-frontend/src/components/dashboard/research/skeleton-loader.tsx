export function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* KPI Cards pulsing grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border/30 bg-card p-4 space-y-3 animate-pulse">
            <div className="size-8 rounded-xl bg-muted/40" />
            <div className="h-6 bg-muted/40 rounded w-1/2" />
            <div className="h-2.5 bg-muted/30 rounded w-5/6" />
          </div>
        ))}
      </div>

      {/* Grid of list cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border/35 bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <div className="h-5 bg-muted/40 rounded w-1/4" />
              <div className="h-5 bg-muted/40 rounded w-1/5" />
            </div>
            <div className="h-4 bg-muted/45 rounded w-5/6" />
            <div className="h-3 bg-muted/35 rounded w-2/3" />
            <div className="space-y-2 border-t border-border/20 pt-3">
              <div className="h-3.5 bg-muted/30 rounded w-4/5" />
              <div className="h-3.5 bg-muted/35 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
