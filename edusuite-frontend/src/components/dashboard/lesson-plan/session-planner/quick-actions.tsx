import React from "react";
import { CheckCircle2, ArrowRight, Download, Printer, FileDown, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuickActionsProps {
  onMarkCompleted: () => void;
  onViewNextTopic: () => void;
}

export function QuickActions({ onMarkCompleted, onViewNextTopic }: QuickActionsProps) {
  const handleDownload = (format: string) => {
    toast.success(`Generating ${format} Document...`, {
      description: "Lesson Plan Session Planner syllabus export is starting.",
    });
  };

  const handlePrint = () => {
    toast.info("Preparing Teaching Plan for Printing...", {
      description: "Formatting hour-wise syllabus schedule.",
    });
    window.print();
  };

  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card shadow-sm space-y-3">
      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="size-4 text-primary" /> Session Planner Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkCompleted}
          className="h-10 text-xs font-bold border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl"
        >
          <CheckCircle2 className="size-4 mb-0.5" />
          <span>Mark Completed</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewNextTopic}
          className="h-10 text-xs font-bold border-blue-500/30 text-blue-600 hover:bg-blue-500/10 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl"
        >
          <ArrowRight className="size-4 mb-0.5" />
          <span>View Next Topic</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload("Lesson Plan Excel")}
          className="h-10 text-xs font-bold border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/10 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl"
        >
          <Download className="size-4 mb-0.5" />
          <span>Download Plan</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="h-10 text-xs font-bold border-violet-500/30 text-violet-600 hover:bg-violet-500/10 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl"
        >
          <Printer className="size-4 mb-0.5" />
          <span>Print Plan</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload("PDF Syllabus Report")}
          className="h-10 text-xs font-bold border-rose-500/30 text-rose-600 hover:bg-rose-500/10 cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl col-span-2 sm:col-span-1"
        >
          <FileDown className="size-4 mb-0.5" />
          <span>Export PDF</span>
        </Button>
      </div>
    </Card>
  );
}
