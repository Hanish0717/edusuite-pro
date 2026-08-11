import { FileText, Printer, FileDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LessonPlanHeaderProps {
  academicYear: string;
  semester: string;
  onRefresh: () => void;
}

export function LessonPlanHeader({ academicYear, semester, onRefresh }: LessonPlanHeaderProps) {
  const handlePrint = () => {
    toast.success("Preparing lesson plan document...", {
      description: "Redirecting to standard print preview.",
    });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleExport = () => {
    toast.success("Exporting Lesson Plans...", {
      description: "PDF compilation started.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 text-xs">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Lesson Plan Management</h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
          <FileText className="size-3.5" /> Academic Year {academicYear} &middot; Semester {semester}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          onClick={onRefresh}
          variant="outline"
          className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9"
        >
          <RefreshCw className="size-3.5 mr-2" /> Refresh
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9"
        >
          <Printer className="size-3.5 mr-2" /> Print
        </Button>
        <Button
          onClick={handleExport}
          className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9"
        >
          <FileDown className="size-3.5 mr-2" /> Export PDF
        </Button>
      </div>
    </div>
  );
}
