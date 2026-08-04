import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { StudentSubmission } from "@/data/faculty-mock-data";

interface LateSubmissionPanelProps {
  submissions: StudentSubmission[];
  dueDate: string;
}

export function LateSubmissionPanel({ submissions, dueDate }: LateSubmissionPanelProps) {
  // Filter for late or overdue submissions
  const delayedSubmissions = submissions.filter((s) => s.status === "Late" || s.status === "Overdue");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Late":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse";
      default:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  return (
    <Panel
      title="Late & Overdue Submission Register"
      description="List of student uploads completed after the official cutoff hour"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      {delayedSubmissions.length > 0 ? (
        <div className="overflow-x-auto max-w-full rounded-xl border">
          <Table className="min-w-[500px] text-xs">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[100px]">Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-[110px] text-center">Due Date</TableHead>
                <TableHead className="w-[110px] text-center">Delay Duration</TableHead>
                <TableHead className="w-[90px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delayedSubmissions.map((sub) => (
                <TableRow key={sub.rollNumber} className="hover:bg-muted/20">
                  <TableCell className="font-mono font-bold">{sub.rollNumber}</TableCell>
                  <TableCell className="font-bold text-foreground">{sub.studentName}</TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground">{dueDate}</TableCell>
                  <TableCell className="text-center font-semibold text-rose-600 flex items-center justify-center gap-1 mt-2.5">
                    <Clock className="size-3.5" />
                    <span>{sub.delayDuration || "Missing submittal"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-3">
          <div className="grid size-9 place-items-center rounded-xl bg-muted">
            <AlertTriangle className="size-4 text-emerald-600" />
          </div>
          <div>
            <h5 className="font-bold text-foreground">Zero delay warnings</h5>
            <p className="text-[0.62rem] max-w-[280px] leading-relaxed mt-0.5">
              All students submitted their worksheets on time for this assignment slot.
            </p>
          </div>
        </div>
      )}
    </Panel>
  );
}
