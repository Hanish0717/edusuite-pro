import { Landmark, Calendar, Award, DollarSign } from "lucide-react";
import type { GrantItem } from "./types";
import { Badge } from "@/components/ui/badge";

interface GrantCardsProps {
  grants: GrantItem[];
}

export function GrantCards({ grants }: GrantCardsProps) {
  const getApprovalBadgeClass = (status: string) => {
    switch (status) {
      case "Disbursed":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "Approved":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "Pending":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  if (grants.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No grants recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {grants.map((gr) => (
        <div
          key={gr.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tag */}
            <div className="flex items-start justify-between gap-3">
              <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="outline" className={getApprovalBadgeClass(gr.approvalStatus)}>
                {gr.approvalStatus}
              </Badge>
            </div>

            {/* Grant Title */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {gr.grantName}
              </h4>
              <p className="text-xs text-primary font-bold mt-1">
                Value: {gr.amount}
              </p>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 col-span-2">
                <Landmark className="size-3.5 text-muted-foreground/75" />
                <span>Sanctioning Agency: <strong className="text-foreground">{gr.agency}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Start: <strong className="text-foreground">{gr.startDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>End: <strong className="text-foreground">{gr.endDate}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
