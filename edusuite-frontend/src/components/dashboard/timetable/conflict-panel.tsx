import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { ConflictItem } from "@/data/faculty-mock-data";

interface ConflictPanelProps {
  conflicts: ConflictItem[];
}

export function ConflictPanel({ conflicts }: ConflictPanelProps) {
  return (
    <Panel
      title="Schedule Conflict Radar"
      description="Auditing real-time overlaps and double bookings"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-3.5 text-xs">
        {conflicts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-6 text-emerald-500 shrink-0" />
            <div>
              <h5 className="font-extrabold text-[0.72rem]">No Conflicts Detected</h5>
              <p className="text-[0.62rem] opacity-80 mt-0.5 leading-normal">
                Syllabus periods, lab venues, and exam invigilation schedules are fully aligned.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {conflicts.map((c, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-700 dark:text-rose-400"
              >
                <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-[0.72rem]">{c.title}</h5>
                  <p className="text-[0.62rem] opacity-80 mt-0.5 leading-normal">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
