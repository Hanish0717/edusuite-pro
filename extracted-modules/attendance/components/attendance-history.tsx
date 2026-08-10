import { History, Eye, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import type { AttendanceHistoryItem } from "@/data/faculty-mock-data";

interface AttendanceHistoryProps {
  history: AttendanceHistoryItem[];
}

export function AttendanceHistory({ history }: AttendanceHistoryProps) {
  const handleView = (id: string) => {
    toast.success(`Loading submitted roll session details: ${id}`, {
      description: "Displaying record copies.",
    });
  };

  return (
    <Panel
      title="Attendance Submission History Log"
      description="Timeline log of recently submitted attendance sheets"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <History className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <h6 className="font-extrabold text-[0.72rem] text-foreground leading-snug truncate">
                  {item.subject} &middot; {item.section}
                </h6>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[0.62rem] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-0.5"><Clock className="size-3 text-primary/60" /> {item.submittedTime}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-0.5"><Users className="size-3 text-primary/60" /> {item.totalStudents} Students</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleView(item.id)}
              variant="outline"
              className="rounded-xl cursor-pointer hover:bg-muted text-[0.65rem] h-8 px-3 shrink-0 flex items-center gap-1 font-semibold"
            >
              <Eye className="size-3.5" /> View
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
