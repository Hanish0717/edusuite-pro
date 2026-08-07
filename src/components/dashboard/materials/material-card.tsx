import { FileText, Download, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface MaterialCardProps {
  material: StudyMaterialItem;
  onClick: () => void;
}

export function MaterialCard({ material, onClick }: MaterialCardProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Visible":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Faculty Only":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-rose-500/10 text-rose-600 border-rose-500/15";
      case "PPT":
        return "bg-amber-500/10 text-amber-600 border-amber-500/15";
      case "Video":
        return "bg-blue-500/10 text-blue-600 border-blue-500/15";
      default:
        return "bg-muted text-muted-foreground border-border/30";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
      <CardContent className="p-5 space-y-4 text-xs">
        <div className="flex justify-between items-start">
          <span className="font-mono text-muted-foreground text-[0.65rem] font-bold">
            {material.code} &middot; Section {material.section}
          </span>
          <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getBadgeStyle(material.visibilityStatus)}`}>
            {material.visibilityStatus}
          </Badge>
        </div>

        <div className="flex gap-3">
          <span className={`grid size-10 place-items-center rounded-xl border shrink-0 font-bold text-[0.7rem] ${getFormatIcon(material.fileType)}`}>
            {material.fileType}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-sm leading-snug group-hover:text-primary transition-colors truncate">
              {material.title}
            </h4>
            <p className="text-[0.62rem] text-muted-foreground mt-0.5 font-bold">
              Unit: {material.unit} &middot; Size: {material.fileSize}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[0.65rem] text-muted-foreground font-medium">
          <span className="flex items-center gap-1"><Clock className="size-3.5 text-primary/60" /> Updated: {material.lastUpdated}</span>
          <span className="flex items-center gap-1"><Download className="size-3.5 text-primary/60" /> {material.downloadCount} Downloads</span>
        </div>
      </CardContent>
    </Card>
  );
}
