import React from "react";
import { Check, Clock, UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { GuestLectureSession } from "@/types/alumni";
import { Badge } from "@/components/ui/badge";

interface ProposalStatusTimelineProps {
  session: GuestLectureSession;
}

const STAGES = [
  { key: "Submitted", label: "Submitted" },
  { key: "Assigned", label: "Assigned to Coordinator" },
  { key: "Under Review", label: "Under Review" },
  { key: "Approved", label: "Approved" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Published", label: "Published" },
  { key: "Completed", label: "Completed" },
];

export const ProposalStatusTimeline: React.FC<ProposalStatusTimelineProps> = ({ session }) => {
  const isRejected = session.status === "Rejected";

  const getStageIndex = (status: GuestLectureSession["status"]) => {
    switch (status) {
      case "Submitted":
        return 0;
      case "Assigned":
        return 1;
      case "Under Review":
      case "Changes Requested":
        return 2;
      case "Approved":
        return 3;
      case "Scheduled":
        return 4;
      case "Published":
        return 5;
      case "Completed":
        return 6;
      default:
        return 0;
    }
  };

  const currentIdx = getStageIndex(session.status);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ASSIGNED COORDINATOR BADGE */}
      {session.assignedCoordinator && (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30">
          <img
            src={session.assignedCoordinator.avatar}
            alt={session.assignedCoordinator.coordinatorName}
            className="size-9 rounded-xl object-cover border border-[#2563EB]/40"
          />
          <div className="min-w-0 flex-1 font-mono">
            <span className="text-[0.65rem] text-[#2563EB] font-bold block">PROPOSAL ASSIGNED TO</span>
            <h5 className="font-extrabold text-xs text-foreground font-sans truncate">
              {session.assignedCoordinator.coordinatorName}
            </h5>
            <span className="text-[0.65rem] text-muted-foreground truncate block">
              {session.assignedCoordinator.dept} Coordinator
            </span>
          </div>
        </div>
      )}

      {/* REJECTED BADGE */}
      {isRejected ? (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-200 text-rose-600 font-mono text-center flex items-center justify-center gap-2 font-bold">
          <XCircle className="size-4" /> Proposal Rejected by Department Coordinator
        </div>
      ) : (
        /* HORIZONTAL 7-STAGE TIMELINE TRACKER */
        <div className="relative pt-2 pb-1 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[540px] px-2">
            {STAGES.map((stage, idx) => {
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={stage.key} className="flex-1 flex flex-col items-center relative group">
                  {/* STEP CIRCLE */}
                  <div
                    className={`size-7 rounded-full flex items-center justify-center font-mono font-bold text-[0.68rem] transition-all z-10 ${
                      isPassed
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-[#2563EB] text-white ring-4 ring-[#2563EB]/20 shadow-md scale-110"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {isPassed ? <Check className="size-3.5" /> : idx + 1}
                  </div>

                  {/* LABEL */}
                  <span
                    className={`text-[0.65rem] font-mono mt-2 text-center max-w-[80px] leading-tight ${
                      isCurrent
                        ? "font-bold text-[#2563EB]"
                        : isPassed
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </span>

                  {/* CONNECTING LINE */}
                  {idx < STAGES.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 ${
                        idx < currentIdx ? "bg-emerald-500" : "bg-border/60"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
