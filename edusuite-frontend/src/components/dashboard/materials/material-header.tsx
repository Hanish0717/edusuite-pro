import { BookOpen, Upload, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MaterialHeaderProps {
  academicYear: string;
  semester: string;
  onRefresh: () => void;
  onUploadTrigger: () => void;
}

export function MaterialHeader({ academicYear, semester, onRefresh, onUploadTrigger }: MaterialHeaderProps) {
  const handleExport = () => {
    toast.success("Exporting study material registry...", {
      description: "PDF compilation started.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 text-xs">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Study Materials</h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
          <BookOpen className="size-3.5" /> Academic Year {academicYear} &middot; Semester {semester}
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
          onClick={handleExport}
          variant="outline"
          className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9"
        >
          <FileSpreadsheet className="size-3.5 mr-2" /> Export
        </Button>
        <Button
          onClick={onUploadTrigger}
          className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 font-bold"
        >
          <Upload className="size-3.5 mr-2" /> Upload Material
        </Button>
      </div>
    </div>
  );
}
