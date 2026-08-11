import { Shield, Users, Layers, AlertCircle } from "lucide-react";
import type { HallAllocation as HallType } from "./types";
import { Progress } from "@/components/ui/progress";

interface HallAllocationProps {
  allocations: HallType[];
}

export function HallAllocation({ allocations }: HallAllocationProps) {
  if (allocations.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No halls allocated currently.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {allocations.map((hall) => {
        const capacityPct = Math.round((hall.assignedStudentsCount / hall.roomCapacity) * 100);
        return (
          <div
            key={hall.id}
            className="flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
          >
            {/* Header Title */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <Layers className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{hall.hallNumber}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{hall.examName}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold bg-muted px-2.5 py-1 rounded-lg text-muted-foreground">
                Cap: {hall.roomCapacity} Seats
              </span>
            </div>

            {/* Occupancy Indicator */}
            <div className="space-y-1.5 pt-1 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" /> Assigned Students: <strong className="text-foreground">{hall.assignedStudentsCount}</strong>
                </span>
                <span className="font-bold text-primary">{capacityPct}% Full</span>
              </div>
              <Progress value={capacityPct} className="h-2" />
            </div>

            {/* Supervisor Info */}
            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <Shield className="size-4 text-muted-foreground/75" />
              <span>Supervisor: <strong className="text-foreground">{hall.supervisor}</strong></span>
              {capacityPct > 90 && (
                <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold ml-auto">
                  <AlertCircle className="size-3 shrink-0" /> Near Capacity
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
