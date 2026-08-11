import React, { useState } from "react";
import { BookOpen, Layers, ChevronDown, ChevronRight, FileText, Download, Eye, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface SubjectAccordionProps {
  materials: StudyMaterialItem[];
  onSelectMaterial: (item: StudyMaterialItem) => void;
}

export function SubjectAccordion({ materials, onSelectMaterial }: SubjectAccordionProps) {
  // Group materials by Subject -> Unit
  const subjectsMap: Record<string, Record<string, StudyMaterialItem[]>> = {};

  materials.forEach((mat) => {
    const subj = mat.subject || "General Coursework";
    const unit = mat.unit || "General Notes";

    if (!subjectsMap[subj]) {
      subjectsMap[subj] = {};
    }
    if (!subjectsMap[subj][unit]) {
      subjectsMap[subj][unit] = [];
    }
    subjectsMap[subj][unit].push(mat);
  });

  const subjectNames = Object.keys(subjectsMap);

  if (subjectNames.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed bg-muted/20 text-muted-foreground text-xs">
        No subject materials available for the active filters.
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5 border-border/80 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Layers className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">
              Subject & Unit-Wise Course Materials Repository
            </h3>
            <p className="text-[0.68rem] text-muted-foreground">
              Syllabus structured view organized by Subject Units and Topics
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs">
          {subjectNames.length} Subjects Mapped
        </Badge>
      </div>

      <Accordion type="multiple" defaultValue={[subjectNames[0] || ""]} className="w-full space-y-3">
        {subjectNames.map((subject) => {
          const unitsMap = subjectsMap[subject] || {};
          const unitKeys = Object.keys(unitsMap);
          const totalSubjectMaterials = unitKeys.reduce((acc, u) => acc + (unitsMap[u]?.length || 0), 0);

          return (
            <AccordionItem
              key={subject}
              value={subject}
              className="border border-border/70 rounded-2xl bg-muted/10 overflow-hidden px-4"
            >
              <AccordionTrigger className="hover:no-underline py-3 text-xs font-bold text-foreground flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BookOpen className="size-4 text-primary shrink-0" />
                  <span className="font-extrabold text-sm tracking-tight text-foreground truncate">
                    {subject}
                  </span>
                  <Badge variant="secondary" className="font-mono text-[0.65rem] px-2 py-0.5 shrink-0">
                    {totalSubjectMaterials} Files
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-4 space-y-3 border-t border-border/40">
                {unitKeys.map((unitName) => {
                  const unitMaterials = unitsMap[unitName] || [];

                  return (
                    <div key={unitName} className="space-y-2 pl-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider pt-1">
                        <span className="p-1 rounded bg-primary/10 text-primary text-[0.62rem]">
                          {unitName}
                        </span>
                        <span>({unitMaterials.length} Topic Materials)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {unitMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            onClick={() => onSelectMaterial(mat)}
                            className="p-3 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer space-y-2 text-xs group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[0.62rem] font-bold text-muted-foreground uppercase font-mono">
                                {mat.code} &middot; {mat.section}
                              </span>
                              <Badge
                                className={
                                  mat.visibilityStatus === "Visible"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.6rem]"
                                    : mat.visibilityStatus === "Scheduled"
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.6rem]"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.6rem]"
                                }
                              >
                                {mat.visibilityStatus}
                              </Badge>
                            </div>

                            <h5 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors break-words">
                              {mat.title}
                            </h5>

                            <p className="text-[0.65rem] text-muted-foreground line-clamp-2">
                              {mat.description}
                            </p>

                            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[0.65rem] text-muted-foreground font-mono">
                              <span className="flex items-center gap-1">
                                <FileText className="size-3 text-primary" /> {mat.fileType} ({mat.fileSize})
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <Download className="size-3" /> {mat.downloadCount}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}
