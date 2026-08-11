import { FileText, Download, Youtube, BookOpen } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { LessonResourceItem } from "@/data/faculty-mock-data";

interface LessonResourcesProps {
  resources: LessonResourceItem[];
}

export function LessonResources({ resources }: LessonResourcesProps) {
  const handleDownload = (title: string) => {
    toast.success(`Downloading Resource: ${title}`, {
      description: "Secure copy download initiated.",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Video Lecture":
      case "NPTEL":
        return Youtube;
      default:
        return FileText;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "PPT":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "PDF Notes":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "bg-violet-500/10 text-violet-600 border-violet-500/20";
    }
  };

  return (
    <Panel
      title="Linked Reference Resources"
      description="Study materials, slides, and videos attached to this plan"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-3">
        {resources.map((res, idx) => {
          const IconComp = getIcon(res.type);
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <IconComp className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h6 className="font-bold truncate leading-snug">{res.title}</h6>
                  <p className="text-[0.6rem] text-muted-foreground mt-0.5">{res.type}</p>
                </div>
              </div>
              <Button
                onClick={() => handleDownload(res.title)}
                variant="outline"
                className="rounded-xl cursor-pointer hover:bg-muted text-[0.65rem] h-8 px-3 shrink-0 flex items-center gap-1 font-semibold"
              >
                <Download className="size-3" /> Get
              </Button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
