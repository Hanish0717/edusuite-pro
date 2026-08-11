import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/panel";
import { Edit2, Download, Paperclip } from "lucide-react";
import { toast } from "sonner";
import type { StudentSubmission } from "@/data/faculty-mock-data";

interface SubmissionPanelProps {
  submissions: StudentSubmission[];
  onOpenEvaluation: (sub: StudentSubmission) => void;
}

export function SubmissionPanel({ submissions, onOpenEvaluation }: SubmissionPanelProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Submitted":
      case "On Time":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Late":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  const getGradingStyle = (status: string) => {
    switch (status) {
      case "Evaluated":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Draft":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading Student Submission Worksheet: ${fileName}`, {
      description: "Secure submission worksheet fetched.",
    });
  };

  return (
    <Panel
      title="Student Submissions Roster"
      description="List of student worksheet uploads, delay timers, and grading statuses"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="overflow-x-auto max-w-full rounded-xl border">
        <Table className="min-w-[550px] text-xs">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[100px]">Roll Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="w-[110px] text-center">Score Marks</TableHead>
              <TableHead className="w-[90px] text-center">Grading</TableHead>
              <TableHead className="w-[90px] text-center">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.rollNumber} className="hover:bg-muted/20">
                <TableCell className="font-mono font-bold">{sub.rollNumber}</TableCell>
                <TableCell className="font-bold text-foreground">
                  <div>
                    <p className="truncate w-[140px]">{sub.studentName}</p>
                    {sub.fileIndicator && sub.fileName && (
                      <p className="text-[0.55rem] text-primary mt-0.5 flex items-center gap-0.5 font-mono">
                        <Paperclip className="size-2.5" /> {sub.fileName}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center font-black text-foreground">
                  {sub.marks !== undefined ? `${sub.marks} / 100` : "--"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`py-0 px-2 rounded text-[0.55rem] font-bold border ${getGradingStyle(sub.evaluationStatus)}`}>
                    {sub.evaluationStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`py-0 px-2 rounded text-[0.55rem] font-bold border ${getBadgeStyle(sub.status)}`}>
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1.5 justify-end">
                    {sub.fileIndicator && sub.fileName && (
                      <Button
                        onClick={() => handleDownload(sub.fileName || "")}
                        variant="outline"
                        className="rounded-lg hover:bg-muted size-8 p-0 shrink-0 cursor-pointer flex justify-center items-center"
                      >
                        <Download className="size-3.5 text-muted-foreground" />
                      </Button>
                    )}
                    <Button
                      onClick={() => onOpenEvaluation(sub)}
                      variant="outline"
                      className="rounded-lg hover:bg-muted size-8 p-0 shrink-0 cursor-pointer flex justify-center items-center"
                    >
                      <Edit2 className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}
