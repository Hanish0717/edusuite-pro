import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MaterialCard } from "./material-card";
import { EmptyState } from "./empty-state";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface MaterialLibraryProps {
  materials: StudyMaterialItem[];
  viewMode: "grid" | "list";
  onSelectMaterial: (mat: StudyMaterialItem) => void;
}

export function MaterialLibrary({ materials, viewMode, onSelectMaterial }: MaterialLibraryProps) {
  if (materials.length === 0) {
    return <EmptyState />;
  }

  const getVisibilityStyle = (status: string) => {
    switch (status) {
      case "Visible":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Faculty Only":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  const handleDownload = (title: string) => {
    toast.success(`Downloading worksheet: ${title}`);
  };

  if (viewMode === "list") {
    return (
      <div className="overflow-x-auto max-w-full rounded-2xl border bg-card text-xs">
        <Table className="min-w-[650px] text-xs">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[80px]">Format</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[110px] text-center">Last Updated</TableHead>
              <TableHead className="w-[100px] text-center">Downloads</TableHead>
              <TableHead className="w-[110px] text-center">Visibility</TableHead>
              <TableHead className="w-[80px] text-right">Get</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((mat) => (
              <TableRow
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                className="hover:bg-muted/20 cursor-pointer transition-colors text-xs"
              >
                <TableCell className="font-bold font-mono text-primary text-center">
                  {mat.fileType}
                </TableCell>
                <TableCell className="font-bold text-foreground">
                  <div>
                    <p className="truncate w-[180px]">{mat.title}</p>
                    <p className="text-[0.6rem] text-muted-foreground mt-0.5">{mat.code} &middot; Sec {mat.section}</p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-muted-foreground">{mat.fileSize}</TableCell>
                <TableCell className="text-center font-medium text-muted-foreground">{mat.lastUpdated}</TableCell>
                <TableCell className="text-center font-bold text-foreground">{mat.downloadCount}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.55rem] font-bold border ${getVisibilityStyle(mat.visibilityStatus)}`}>
                    {mat.visibilityStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(mat.title);
                    }}
                    variant="outline"
                    className="size-8 p-0 rounded-xl hover:bg-muted cursor-pointer shrink-0 inline-flex items-center justify-center"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((mat) => (
        <MaterialCard
          key={mat.id}
          material={mat}
          onClick={() => onSelectMaterial(mat)}
        />
      ))}
    </div>
  );
}
