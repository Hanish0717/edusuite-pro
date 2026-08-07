import { FileText, Download, Clock, Eye, Edit, Trash2, Share2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface MaterialCardProps {
  material: StudyMaterialItem;
  onClick: () => void;
  onEdit?: (m: StudyMaterialItem) => void;
  onDelete?: (id: string) => void;
}

export function MaterialCard({ material, onClick, onEdit, onDelete }: MaterialCardProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Visible":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Scheduled":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Draft":
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

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === "share") {
      toast.success("Share Link Copied!", {
        description: `Direct LMS link for "${material.title}" copied to clipboard.`,
      });
    } else if (action === "edit") {
      if (onEdit) onEdit(material);
      else onClick();
    } else if (action === "delete") {
      toast.error("Material Removed", {
        description: `Deleted "${material.title}" from roster.`,
      });
      if (onDelete) onDelete(material.id);
    }
  };

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group flex flex-col justify-between h-full"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl pointer-events-none" />
      <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs flex flex-col justify-between h-full">
        {/* Top bar: Code, Section & Status */}
        <div className="flex justify-between items-start gap-2">
          <span className="font-mono text-muted-foreground text-[0.65rem] font-bold truncate">
            {material.code} &middot; {material.section}
          </span>
          <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getBadgeStyle(material.visibilityStatus)}`}>
            {material.visibilityStatus}
          </Badge>
        </div>

        {/* Title & Format */}
        <div className="flex gap-3 items-start">
          <span className={`grid size-10 place-items-center rounded-xl border shrink-0 font-bold text-[0.7rem] ${getFormatIcon(material.fileType)}`}>
            {material.fileType}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug group-hover:text-primary transition-colors break-words">
              {material.title}
            </h4>
            <p className="text-[0.62rem] text-muted-foreground mt-0.5 font-semibold">
              Subject: {material.subject} &middot; {material.unit}
            </p>
          </div>
        </div>

        {/* Metadata: Uploaded By, Date, Views, Downloads */}
        <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-[0.65rem] space-y-1 font-mono">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-1 font-sans font-medium"><User className="size-3 text-primary" /> {material.uploadedBy || "Faculty"}</span>
            <span>{material.uploadDate}</span>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <span className="flex items-center gap-1 text-emerald-600 font-bold"><Download className="size-3" /> {material.downloadCount} Downloads</span>
            <span className="flex items-center gap-1 text-blue-600 font-bold"><Eye className="size-3" /> {material.studentViews || 120} Views</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClick}
            className="h-7 text-[0.65rem] font-bold px-2.5 rounded-lg cursor-pointer"
          >
            <Eye className="size-3 mr-1" /> Preview
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleAction(e, "edit")}
              className="size-7 rounded-lg text-muted-foreground hover:text-primary cursor-pointer"
              title="Edit Material"
            >
              <Edit className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleAction(e, "share")}
              className="size-7 rounded-lg text-muted-foreground hover:text-blue-600 cursor-pointer"
              title="Share Material"
            >
              <Share2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleAction(e, "delete")}
              className="size-7 rounded-lg text-muted-foreground hover:text-rose-600 cursor-pointer"
              title="Delete Material"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

