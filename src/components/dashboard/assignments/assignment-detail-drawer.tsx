import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ClipboardList, BookOpen } from "lucide-react";

import { SubmissionPanel } from "./submission-panel";
import { LateSubmissionPanel } from "./late-submission-panel";
import { AssignmentAnalytics } from "./assignment-analytics";
import { AssignmentTimeline } from "./assignment-timeline";
import { QuickActions } from "./quick-actions";
import type { AssignmentItem, StudentSubmission } from "@/data/faculty-mock-data";

interface AssignmentDetailDrawerProps {
  assignment: AssignmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenEvaluation: (sub: StudentSubmission) => void;
}

export function AssignmentDetailDrawer({
  assignment,
  open,
  onOpenChange,
  onOpenEvaluation,
}: AssignmentDetailDrawerProps) {
  if (!assignment) return null;

  const submissionPct = assignment.totalStudents > 0
    ? Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] overflow-y-auto rounded-l-3xl p-6 text-xs">
        <SheetHeader className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-mono font-bold text-[0.65rem] uppercase">
            <span>Code: {assignment.code}</span>
            <span>&middot;</span>
            <span>Max Score: {assignment.maxMarks} Marks</span>
            <span>&middot;</span>
            <span>AY {assignment.academicYear}</span>
          </div>
          <SheetTitle className="font-display text-lg font-extrabold text-foreground leading-snug">
            {assignment.title}
          </SheetTitle>
          <SheetDescription className="font-medium text-muted-foreground text-[0.7rem] leading-normal">
            Section: {assignment.section} &middot; Due by: {assignment.dueDate} &middot; Semester: {assignment.semester}
          </SheetDescription>
        </SheetHeader>

        {/* Tab navigation panels */}
        <Tabs defaultValue="submissions" className="w-full mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto gap-1 bg-muted p-1 rounded-2xl">
            <TabsTrigger value="submissions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Submissions</TabsTrigger>
            <TabsTrigger value="late" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Delays</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Analytics</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Logs</TabsTrigger>
            <TabsTrigger value="actions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Actions</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}
          <div className="focus-visible:outline-none">
            {/* SUBMISSIONS PANEL */}
            <TabsContent value="submissions" className="focus-visible:outline-none space-y-4">
              <SubmissionPanel
                submissions={assignment.submissions}
                onOpenEvaluation={onOpenEvaluation}
              />
            </TabsContent>

            {/* LATE SUBMISSIONS */}
            <TabsContent value="late" className="focus-visible:outline-none space-y-4">
              <LateSubmissionPanel submissions={assignment.submissions} dueDate={assignment.dueDate} />
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics" className="focus-visible:outline-none space-y-4">
              <AssignmentAnalytics submissions={assignment.submissions} />
            </TabsContent>

            {/* TIMELINE LOG */}
            <TabsContent value="timeline" className="focus-visible:outline-none space-y-4">
              <AssignmentTimeline timeline={assignment.timeline} />
            </TabsContent>

            {/* QUICK ACTIONS */}
            <TabsContent value="actions" className="focus-visible:outline-none space-y-4">
              <QuickActions assignmentId={assignment.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
