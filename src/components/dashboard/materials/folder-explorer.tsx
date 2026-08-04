import { useState } from "react";
import { Folder, ChevronRight, ChevronDown, FileText } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface FolderExplorerProps {
  material: StudyMaterialItem;
}

export function FolderExplorer({ material }: FolderExplorerProps) {
  const [subjectOpen, setSubjectOpen] = useState(true);
  const [unitOpen, setUnitOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);

  return (
    <Panel
      title="Study Materials Folder Explorer"
      description="Expandable hierarchical library grouping items by syllabus units"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-2.5 select-none font-medium">
        {/* Subject Folder */}
        <div className="space-y-1">
          <div
            onClick={() => setSubjectOpen(!subjectOpen)}
            className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 cursor-pointer"
          >
            {subjectOpen ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
            <Folder className="size-4 text-amber-500 fill-amber-500/20" />
            <span className="font-extrabold text-foreground">{material.subject} ({material.code})</span>
          </div>

          {subjectOpen && (
            <div className="pl-6 space-y-1 border-l border-border/80 ml-4 py-1">
              {/* Unit Folder */}
              <div className="space-y-1">
                <div
                  onClick={() => setUnitOpen(!unitOpen)}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 cursor-pointer"
                >
                  {unitOpen ? <ChevronDown className="size-3.5 text-muted-foreground" /> : <ChevronRight className="size-3.5 text-muted-foreground" />}
                  <Folder className="size-3.5 text-amber-500 fill-amber-500/20" />
                  <span className="font-bold text-foreground">{material.unit}</span>
                </div>

                {unitOpen && (
                  <div className="pl-6 space-y-1 border-l border-border/80 ml-3.5 py-1">
                    {/* Material Type Folder */}
                    <div className="space-y-1">
                      <div
                        onClick={() => setTypeOpen(!typeOpen)}
                        className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 cursor-pointer"
                      >
                        {typeOpen ? <ChevronDown className="size-3.5 text-muted-foreground" /> : <ChevronRight className="size-3.5 text-muted-foreground" />}
                        <Folder className="size-3.5 text-amber-500 fill-amber-500/20" />
                        <span className="font-bold text-foreground">{material.category}</span>
                      </div>

                      {typeOpen && (
                        <div className="pl-6 space-y-1 border-l border-border/80 ml-3.5 py-1">
                          {/* File Leaf Node */}
                          <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-primary/5 text-primary border border-primary/10">
                            <FileText className="size-3.5" />
                            <span className="font-mono text-[0.62rem] truncate w-full font-bold">{material.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
