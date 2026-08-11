import type { ResearchAnalyticsInfo } from "./types";
import { cn } from "@/lib/utils";

interface ResearchAnalyticsProps {
  analytics: ResearchAnalyticsInfo;
}

export function ResearchAnalytics({ analytics }: ResearchAnalyticsProps) {
  const maxPubCount = Math.max(...analytics.publicationsByYear.map((d) => d.count), 1);
  const maxCitations = Math.max(...analytics.citationsTrend.map((d) => d.count), 1);
  const maxCategory = Math.max(...analytics.categoryDistribution.map((d) => d.count), 1);
  const maxGrant = Math.max(...analytics.grantsByYear.map((d) => d.amount), 1);

  return (
    <div className="space-y-6">
      {/* Publications by Year & Citations Curve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Publications by Year */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Publications by Year</h4>
          <div className="flex items-end gap-3 h-40 pt-4 px-2">
            {analytics.publicationsByYear.map((item) => {
              const height = Math.round((item.count / maxPubCount) * 100);
              return (
                <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-foreground">{item.count}</span>
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-blue-500 to-indigo-600 transition-all duration-700 hover:opacity-85 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? "8px" : "2px" }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-muted-foreground">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Citations Trend */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Citations Trend</h4>
          <div className="flex items-end gap-3 h-40 pt-4 px-2">
            {analytics.citationsTrend.map((item) => {
              const height = Math.round((item.count / maxCitations) * 100);
              return (
                <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-foreground">{item.count}</span>
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-teal-600 transition-all duration-700 hover:opacity-85 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? "8px" : "2px" }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-muted-foreground">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Publications categories and Research Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Publication Categories */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Publication Categories</h4>
          <div className="space-y-3">
            {analytics.categoryDistribution.map((item) => {
              const barWidth = Math.round((item.count / maxCategory) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>{item.name}</span>
                    <span className="tabular-nums font-bold">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research Areas */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Research Area Breakdown</h4>
          <div className="space-y-3">
            {analytics.researchAreas.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-foreground">
                  <span>{item.name}</span>
                  <span className="tabular-nums font-bold">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grants and project status grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grants by Year */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Research Funding Grants ($)</h4>
          <div className="flex items-end gap-3 h-40 pt-4 px-2">
            {analytics.grantsByYear.map((item) => {
              const height = Math.round((item.amount / maxGrant) * 100);
              return (
                <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-foreground">${item.amount}</span>
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-amber-500 to-rose-500 transition-all duration-700 hover:opacity-85 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: item.amount > 0 ? "8px" : "2px" }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-muted-foreground">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Status */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Research Projects Status</h4>
          <div className="space-y-3">
            {analytics.projectStatusDistribution.map((item) => {
              const count = item.count;
              const barWidth = count > 0 ? 50 : 0; // simple mock bar
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>{item.status} Projects</span>
                    <span className="tabular-nums font-bold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${count * 30}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
