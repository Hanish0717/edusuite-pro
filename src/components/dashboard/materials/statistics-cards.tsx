import { FileText, Play, Database, Download, FileSpreadsheet, Layers, BookOpen, HelpCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  materials: StudyMaterialItem[];
}

export function StatisticsCards({ materials }: StatisticsCardsProps) {
  const total = materials.length;
  const pdfs = materials.filter((m) => m.fileType === "PDF" || m.category === "Lecture Notes").length;
  const ppts = materials.filter((m) => m.fileType === "PPT" || m.category === "PPT").length;
  const labManuals = materials.filter((m) => m.category === "Lab Manual").length;
  const prevPapers = materials.filter((m) => m.category === "Previous Papers" || m.category === "Question Bank").length;
  const videos = materials.filter((m) => m.fileType === "Video" || m.category === "Video Lecture").length;
  const totalDownloads = materials.reduce((sum, m) => sum + m.downloadCount, 0);
  const pendingUploads = materials.filter((m) => m.visibilityStatus === "Draft" || m.visibilityStatus === "Scheduled").length;

  const cards = [
    { label: "Total Materials", value: `${total}`, sub: "Files Uploaded", icon: Layers, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "PDF Notes", value: `${pdfs}`, sub: "Course Guides", icon: FileText, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Presentations", value: `${ppts}`, sub: "Slide Decks", icon: FileSpreadsheet, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "Lab Manuals", value: `${labManuals}`, sub: "Experiments", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Previous Papers", value: `${prevPapers}`, sub: "Past Exams", icon: HelpCircle, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Video Links", value: `${videos}`, sub: "Demonstrations", icon: Play, color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    { label: "Total Downloads", value: `${totalDownloads}`, sub: "Student Downloads", icon: Download, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    { label: "Pending Uploads", value: `${pendingUploads}`, sub: "Drafts / Scheduled", icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-8 text-xs">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 h-full min-w-0"
        >
          <CardContent className="flex flex-col justify-between p-3.5 sm:p-4 h-full">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[0.62rem] font-bold text-muted-foreground uppercase leading-snug break-words" title={card.label}>
                {card.label}
              </span>
              <span className={`grid size-7 shrink-0 place-items-center rounded-xl border ${card.color}`}>
                <card.icon className="size-3.5" />
              </span>
            </div>
            <div>
              <p className="font-display text-xl font-extrabold text-foreground font-mono whitespace-nowrap">
                {card.value}
              </p>
              <p className="text-[0.65rem] text-muted-foreground font-medium truncate">
                {card.sub}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

