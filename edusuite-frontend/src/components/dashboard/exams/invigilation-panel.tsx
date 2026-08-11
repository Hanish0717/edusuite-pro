import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import type { InvigilationDuty } from "./types";
import { InvigilationStatusBadge } from "./exam-badges";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InvigilationPanelProps {
  duties: InvigilationDuty[];
}

export function InvigilationPanel({ duties }: InvigilationPanelProps) {
  const handleAcknowledge = (dutyId: string) => {
    toast.success("Duty Acknowledged", {
      description: `Invigilation duty (ID: ${dutyId}) has been successfully confirmed.`,
    });
  };

  if (duties.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No invigilation duties assigned.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-5 py-4 text-left">Exam</th>
              <th className="px-5 py-4 text-left">Schedule</th>
              <th className="px-5 py-4 text-left">Venue Location</th>
              <th className="px-5 py-4 text-center">Assigned Students</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {duties.map((duty) => (
              <tr key={duty.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-4 font-bold text-foreground">{duty.examName}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1 text-xs text-foreground font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-muted-foreground" /> {duty.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-muted-foreground" /> {duty.time}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground"><MapPin className="size-3.5 text-muted-foreground" /> {duty.hall}</span>
                    <span className="pl-5 text-[11px]">{duty.building} · {duty.floor}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg text-xs font-semibold text-foreground">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>{duty.studentCount}</span>
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <InvigilationStatusBadge status={duty.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  {duty.status === "Assigned" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-bold border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                      onClick={() => handleAcknowledge(duty.id)}
                    >
                      <CheckCircle className="size-3.5 mr-1" /> Acknowledge
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic font-medium">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
