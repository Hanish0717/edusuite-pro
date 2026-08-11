import { Printer, Download, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimetableHeaderProps {
  academicYear: string;
  semester: string;
  onRefresh: () => void;
}

export function TimetableHeader({ academicYear, semester, onRefresh }: TimetableHeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    toast.success("Preparing timetable print layout...", {
      description: "Redirecting to standard print preview.",
    });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleDownload = () => {
    toast.success("Downloading Timetable PDF...", {
      description: "Compiling weekly grid layout.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Timetable Management</h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
          <Calendar className="size-3.5" /> Academic Year {academicYear} &middot; Semester {semester} &middot; {currentDate}
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
          onClick={handleDownload}
          className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9"
        >
          <Download className="size-3.5 mr-2" /> Download PDF
        </Button>
      </div>
    </div>
  );
}
