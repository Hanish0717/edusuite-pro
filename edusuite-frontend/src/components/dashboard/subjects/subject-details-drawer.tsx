import { BookOpen, BookText, Settings, ShieldAlert, Award, Calendar, Layers } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SyllabusProgress } from "./syllabus-progress";
import { CourseOutcomeCards } from "./course-outcome-cards";
import { ProgramOutcomeSection } from "./program-outcome-section";
import { ReferenceBooks } from "./reference-books";
import { LaboratoryDetails } from "./laboratory-details";
import { AssignedSections } from "./assigned-sections";
import { SubjectTimeline } from "./subject-timeline";
import { QuickActions } from "./quick-actions";
import type { SubjectItem } from "@/data/faculty-mock-data";

interface SubjectDetailsDrawerProps {
  subject: SubjectItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubjectDetailsDrawer({ subject, open, onOpenChange }: SubjectDetailsDrawerProps) {
  if (!subject) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] overflow-y-auto rounded-l-3xl p-6 text-xs">
        <SheetHeader className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-mono font-bold text-[0.65rem] uppercase">
            <span>{subject.code}</span>
            <span>&middot;</span>
            <span>{subject.type}</span>
            <span>&middot;</span>
            <span>Regulation {subject.regulation}</span>
          </div>
          <SheetTitle className="font-display text-lg font-extrabold text-foreground leading-snug">
            {subject.name}
          </SheetTitle>
          <SheetDescription className="font-medium text-muted-foreground text-[0.7rem] leading-normal">
            Assigned for Semester {subject.semester} &middot; {subject.credits} Credits &middot; {subject.weeklyHours} Hrs/Week
          </SheetDescription>
        </SheetHeader>

        {/* Dynamic Details Tabs */}
        <Tabs defaultValue="syllabus" className="w-full mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-muted p-1 rounded-2xl">
            <TabsTrigger value="syllabus" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Syllabus</TabsTrigger>
            <TabsTrigger value="outcomes" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Outcomes</TabsTrigger>
            <TabsTrigger value="resources" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">References</TabsTrigger>
            <TabsTrigger value="sections" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Sections</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Timeline</TabsTrigger>
            <TabsTrigger value="actions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Actions</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}
          <div className="focus-visible:outline-none">
            <TabsContent value="syllabus" className="space-y-4 focus-visible:outline-none">
              {/* Syllabus Progress */}
              <SyllabusProgress progress={subject.syllabusProgress} />
              
              {/* Lab Details (if applicable) */}
              {subject.labDetails && (
                <LaboratoryDetails labDetails={subject.labDetails} />
              )}
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-4 focus-visible:outline-none">
              {/* COs */}
              <CourseOutcomeCards outcomes={subject.courseOutcomes} />
              
              {/* POs */}
              <ProgramOutcomeSection outcomes={subject.programOutcomes} />
            </TabsContent>

            <TabsContent value="resources" className="space-y-4 focus-visible:outline-none">
              {/* Books & References */}
              <ReferenceBooks books={subject.books} />
            </TabsContent>

            <TabsContent value="sections" className="space-y-4 focus-visible:outline-none">
              {/* Sections details */}
              <AssignedSections sections={subject.sectionsDetails} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 focus-visible:outline-none">
              {/* Subject Timeline */}
              <SubjectTimeline timeline={subject.timeline} />
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 focus-visible:outline-none">
              {/* Quick Actions Cockpit */}
              <QuickActions subjectId={subject.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
