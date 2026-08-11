import { Download, FileSpreadsheet, History, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DownloadCenter() {
  const handleDownload = (label: string, fileType: string) => {
    toast.success(`Exporting ${label}`, {
      description: `Generating and downloading ${fileType} document...`,
    });
  };

  const downloads = [
    {
      title: "Export Profile",
      desc: "Download complete faculty curriculum vitae & bio (.pdf)",
      icon: Download,
      fileType: "PDF",
    },
    {
      title: "Download Activity Log",
      desc: "Export portal access, login, and modification history (.csv)",
      icon: History,
      fileType: "CSV",
    },
    {
      title: "Download Teaching History",
      desc: "Export course allocations, section logs, and workload (.xlsx)",
      icon: BookOpen,
      fileType: "XLSX",
    },
    {
      title: "Download Research Profile",
      desc: "Export publications, citations, patents, and grant reports (.pdf)",
      icon: Award,
      fileType: "PDF",
    },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="size-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Download className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">Downloads & Exports Center</h3>
          <p className="text-xs text-muted-foreground">Download official faculty records, teaching history, activity logs, and research portfolios.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {downloads.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start justify-between gap-3 p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Icon className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs font-bold gap-1 shrink-0"
                onClick={() => handleDownload(item.title, item.fileType)}
              >
                <Download className="size-3" /> {item.fileType}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
