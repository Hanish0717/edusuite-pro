import { FileText, Play, FolderArchive, Database, Download, FileSpreadsheet, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  materials: StudyMaterialItem[];
}

export function StatisticsCards({ materials }: StatisticsCardsProps) {
  const total = materials.length;
  const pdfs = materials.filter((m) => m.fileType === "PDF").length;
  const ppts = materials.filter((m) => m.fileType === "PPT").length;
  const videos = materials.filter((m) => m.fileType === "Video").length;
  const qbanks = materials.filter((m) => m.category === "Question Bank").length;
  
  const totalDownloads = materials.reduce((sum, m) => sum + m.downloadCount, 0);

  // Storage sum mockup: parse sizing strings like "2.4 MB"
  const storageSum = materials.reduce((sum, m) => {
    const size = parseFloat(m.fileSize.replace(" MB", "")) || 0;
    return sum + size;
  }, 0);

  const cards = [
    { label: "Total Materials", value: `${total} files`, icon: Layers, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "PDF Documents", value: `${pdfs} PDFs`, icon: FileText, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "PPT Presentations", value: `${ppts} PPTs`, icon: FileSpreadsheet, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Video Lectures", value: `${videos} clips`, icon: Play, color: "bg-rose-500/10 text-rose-600 border-rose-500/10" },
    { label: "Storage Used", value: `${storageSum.toFixed(1)} MB`, icon: Database, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
    { label: "Total Downloads", value: `${totalDownloads} hits`, icon: Download, color: "bg-teal-500/10 text-teal-600 border-teal-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1"
        >
          <CardContent className="flex flex-col items-center text-center p-4">
            <span className={`grid size-9 place-items-center rounded-xl border mb-2.5 ${card.color}`}>
              <card.icon className="size-4.5" />
            </span>
            <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.55rem]">
              {card.label}
            </p>
            <p className="mt-1 text-base font-black tracking-tight text-foreground">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
